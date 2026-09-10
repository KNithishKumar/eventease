const mongoose = require('mongoose');
const crypto = require('crypto');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const { promoteWaitlistUser } = require('../services/waitlistService');

// @desc    Register student for an event or join waitlist
// @route   POST /api/events/:id/register
// @access  Private (Student)
const registerForEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.status !== 'approved') {
      return res.status(400).json({ message: 'This event is not open for registration' });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({ message: 'Registration deadline has passed for this event' });
    }

    // Check if already registered or waitlisted
    const existingRegistration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: { $in: ['registered', 'waitlisted'] }
    });

    if (existingRegistration) {
      return res.status(400).json({
        message: existingRegistration.status === 'registered'
          ? 'You are already registered for this event'
          : `You are already on the waitlist (Position #${existingRegistration.waitlistPosition})`
      });
    }

    // Count current active registrations
    const registeredCount = await Registration.countDocuments({
      event: eventId,
      status: 'registered'
    });

    let status = 'registered';
    let waitlistPosition = null;

    if (registeredCount >= event.capacity) {
      status = 'waitlisted';
      const currentWaitlistCount = await Registration.countDocuments({
        event: eventId,
        status: 'waitlisted'
      });
      waitlistPosition = currentWaitlistCount + 1;
    }

    // Payment processing logic for Paid events
    const isPaidEvent = event.eventType === 'Paid' || event.registrationFee > 0;
    const paymentMethod = isPaidEvent ? (req.body.paymentMethod || 'UPI') : 'Free';
    const paymentId = isPaidEvent ? (req.body.paymentId || `PAY-${paymentMethod}-${Date.now()}`) : '';
    const paymentStatus = isPaidEvent ? 'paid' : 'free';
    const amountPaid = isPaidEvent ? event.registrationFee : 0;

    // Generate registration ID & secure QR Token
    const registrationId = `REG-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrPayload = `${registrationId}:${userId}:${eventId}:${Date.now()}`;
    const qrToken = crypto.createHash('sha256').update(qrPayload).digest('hex');

    const registration = await Registration.create({
      user: userId,
      event: eventId,
      registrationId,
      qrToken,
      status,
      waitlistPosition,
      paymentStatus,
      paymentMethod,
      paymentId,
      amountPaid,
      registeredAt: new Date()
    });

    // Create Notification
    const notifMessage = status === 'registered'
      ? `Registration confirmed for "${event.title}". View your digital QR ticket in My Events!`
      : `You are added to the waitlist for "${event.title}" at position #${waitlistPosition}. We will notify you if a seat opens up!`;

    await Notification.create({
      user: userId,
      event: event._id,
      title: status === 'registered' ? '✅ Registration Confirmed' : '⏳ Added to Waitlist',
      message: notifMessage,
      type: status === 'registered' ? 'system' : 'waitlist_promoted'
    });

    res.status(201).json({
      message: status === 'registered' ? 'Registration successful!' : 'Added to waitlist successfully!',
      registration: await registration.populate('event')
    });
  } catch (error) {
    console.error('[Registration Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's registrations (My Events)
// @route   GET /api/registrations/my
// @access  Private (Student)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email department' }
      })
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get ticket by registration ID or registration DB ID
// @route   GET /api/registrations/ticket/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const isObjectId = mongoose.Types.ObjectId.isValid(req.params.id);
    const query = isObjectId
      ? { $or: [{ _id: req.params.id }, { registrationId: req.params.id }] }
      : { registrationId: req.params.id };

    const registration = await Registration.findOne(query)
      .populate('user', 'name email department year phone')
      .populate('event');

    if (!registration) {
      return res.status(404).json({ message: 'Ticket registration not found' });
    }

    const regUserId = registration.user?._id ? registration.user._id.toString() : registration.user?.toString();
    const organizerId = registration.event?.organizer?._id ? registration.event.organizer._id.toString() : registration.event?.organizer?.toString();
    const reqUserId = req.user._id.toString();

    if (
      regUserId !== reqUserId &&
      organizerId !== reqUserId &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to access this ticket' });
    }

    res.json(registration);
  } catch (error) {
    console.error('[Get Ticket Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registrations for an event (Organizer view)
// @route   GET /api/events/:id/registrations
// @access  Private (Organizer / Admin)
const getEventRegistrations = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { search, department, year, checkedIn, status } = req.query;

    let filter = { event: eventId };
    if (status) {
      filter.status = status;
    } else {
      filter.status = { $in: ['registered', 'waitlisted'] };
    }

    if (checkedIn !== undefined && checkedIn !== '') {
      filter.checkedIn = checkedIn === 'true';
    }

    let registrations = await Registration.find(filter)
      .populate('user', 'name email department year phone')
      .sort({ createdAt: -1 });

    // In-memory filter for user name/email/dept/year
    if (search || department || year) {
      registrations = registrations.filter((reg) => {
        const u = reg.user;
        if (!u) return false;
        const matchesSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || reg.registrationId.toLowerCase().includes(search.toLowerCase());
        const matchesDept = !department || department === 'All' || u.department === department;
        const matchesYear = !year || year === 'All' || u.year === year;
        return matchesSearch && matchesDept && matchesYear;
      });
    }

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getTicketById,
  getEventRegistrations
};
