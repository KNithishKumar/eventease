const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get all public approved events (with filtering, search, recommendations)
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const {
      search,
      category,
      department,
      eventType,
      dateFilter, // 'today', 'this_week', 'this_month', 'upcoming'
      recommended,
      limit
    } = req.query;

    let query = { status: 'approved' };

    // Search query
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Department filter
    if (department && department !== 'All') {
      query.department = { $in: [department, 'All Departments'] };
    }

    // Event type filter (Free / Paid)
    if (eventType && eventType !== 'All') {
      query.eventType = eventType;
    }

    // Date filtering
    const now = new Date();
    if (dateFilter === 'today') {
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      query.date = { $gte: now, $lte: endOfDay };
    } else if (dateFilter === 'this_week') {
      const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      query.date = { $gte: now, $lte: endOfWeek };
    } else if (dateFilter === 'this_month') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      query.date = { $gte: now, $lte: endOfMonth };
    } else {
      // Default: show upcoming and ongoing events
      query.date = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
    }

    let events = await Event.find(query)
      .populate('organizer', 'name email department')
      .sort({ date: 1 });

    // Populate seat metrics (registered & waitlist counts)
    const eventsWithStats = await Promise.all(
      events.map(async (ev) => {
        const registeredCount = await Registration.countDocuments({
          event: ev._id,
          status: 'registered'
        });
        const waitlistCount = await Registration.countDocuments({
          event: ev._id,
          status: 'waitlisted'
        });
        const evObj = ev.toObject();
        evObj.registeredCount = registeredCount;
        evObj.waitlistCount = waitlistCount;
        evObj.availableSeats = Math.max(0, ev.capacity - registeredCount);
        evObj.isFull = registeredCount >= ev.capacity;
        return evObj;
      })
    );

    // Rule-based Recommendation engine if recommended=true & user present
    if (recommended === 'true' && req.user && req.user.interests && req.user.interests.length > 0) {
      const userInterests = req.user.interests.map((i) => i.toLowerCase());
      eventsWithStats.sort((a, b) => {
        const scoreA = userInterests.includes(a.category.toLowerCase()) ? 2 : 0;
        const scoreB = userInterests.includes(b.category.toLowerCase()) ? 2 : 0;
        return scoreB - scoreA;
      });
    }

    if (limit) {
      return res.json(eventsWithStats.slice(0, parseInt(limit)));
    }

    res.json(eventsWithStats);
  } catch (error) {
    console.error('[Get Events Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get event details by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email department phone');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registeredCount = await Registration.countDocuments({
      event: event._id,
      status: 'registered'
    });

    const waitlistCount = await Registration.countDocuments({
      event: event._id,
      status: 'waitlisted'
    });

    const eventObj = event.toObject();
    eventObj.registeredCount = registeredCount;
    eventObj.waitlistCount = waitlistCount;
    eventObj.availableSeats = Math.max(0, event.capacity - registeredCount);
    eventObj.isFull = registeredCount >= event.capacity;

    res.json(eventObj);
  } catch (error) {
    console.error('[Get Event By ID Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new event (Organizer)
// @route   POST /api/events
// @access  Private (Organizer)
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      venue,
      date,
      startTime,
      endTime,
      registrationDeadline,
      capacity,
      eventType,
      registrationFee,
      eligibility,
      department,
      rules,
      contact,
      upiId,
      bankName,
      bankAccountNumber,
      bankIfsc,
      accountHolderName
    } = req.body;

    let imagePath = '/uploads/default-event.jpg';
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const event = await Event.create({
      title,
      description,
      image: imagePath,
      category,
      organizer: req.user._id,
      venue,
      date,
      startTime,
      endTime,
      registrationDeadline,
      capacity: Number(capacity),
      eventType: eventType || 'Free',
      registrationFee: registrationFee ? Number(registrationFee) : 0,
      eligibility: eligibility || 'All Students',
      department: department || 'All Departments',
      rules: rules || 'Standard college rules apply.',
      contact,
      upiId: upiId || '',
      bankName: bankName || '',
      bankAccountNumber: bankAccountNumber || '',
      bankIfsc: bankIfsc || '',
      accountHolderName: accountHolderName || '',
      status: 'pending' // Admin approval required
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('[Create Event Error]:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update event (Organizer)
// @route   PUT /api/events/:id
// @access  Private (Organizer)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check organizer ownership or admin
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    // Business rule: Cannot edit an event after it has started
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: 'Cannot edit an event that has already started or ended.' });
    }

    const fields = [
      'title',
      'description',
      'category',
      'venue',
      'date',
      'startTime',
      'endTime',
      'registrationDeadline',
      'capacity',
      'eventType',
      'registrationFee',
      'eligibility',
      'department',
      'rules',
      'contact',
      'upiId',
      'bankName',
      'bankAccountNumber',
      'bankIfsc',
      'accountHolderName'
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    if (req.file) {
      event.image = `/uploads/${req.file.filename}`;
    }

    // If edited by organizer, reset status to pending unless admin edited
    if (req.user.role === 'organizer') {
      event.status = 'pending';
      event.rejectionReason = '';
    }

    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } catch (error) {
    console.error('[Update Event Error]:', error);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer / Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    // Remove associated registrations & feedback
    await Registration.deleteMany({ event: event._id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event and associated registrations deleted successfully' });
  } catch (error) {
    console.error('[Delete Event Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get events created by logged-in organizer
// @route   GET /api/events/organizer/my
// @access  Private (Organizer)
const getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id }).sort({ createdAt: -1 });

    const eventsWithStats = await Promise.all(
      events.map(async (ev) => {
        const registeredCount = await Registration.countDocuments({ event: ev._id, status: 'registered' });
        const waitlistCount = await Registration.countDocuments({ event: ev._id, status: 'waitlisted' });
        const checkedInCount = await Registration.countDocuments({ event: ev._id, checkedIn: true });

        const evObj = ev.toObject();
        evObj.registeredCount = registeredCount;
        evObj.waitlistCount = waitlistCount;
        evObj.checkedInCount = checkedInCount;
        evObj.attendancePercentage = registeredCount > 0 ? Math.round((checkedInCount / registeredCount) * 100) : 0;
        return evObj;
      })
    );

    res.json(eventsWithStats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
};
