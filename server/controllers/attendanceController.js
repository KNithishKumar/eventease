const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Mark attendance by QR Code scan or manual registration ID
// @route   POST /api/attendance/check-in
// @access  Private (Organizer / Admin)
const checkInAttendee = async (req, res) => {
  try {
    const { qrToken, registrationId, eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required' });
    }

    if (!qrToken && !registrationId) {
      return res.status(400).json({ message: 'QR token or Registration ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify organizer ownership
    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        message: 'Unauthorized: You can only scan attendance for your own events'
      });
    }

    let registration;
    if (qrToken) {
      registration = await Registration.findOne({ qrToken, event: eventId }).populate(
        'user',
        'name email department year phone'
      );
    } else if (registrationId) {
      registration = await Registration.findOne({ registrationId, event: eventId }).populate(
        'user',
        'name email department year phone'
      );
    }

    if (!registration) {
      return res.status(404).json({
        message: 'Invalid Ticket: Registration does not exist or does not belong to this event'
      });
    }

    if (registration.status !== 'registered') {
      return res.status(400).json({
        message: `Invalid Ticket Status: Student registration is '${registration.status}'`
      });
    }

    if (registration.checkedIn) {
      return res.status(400).json({
        message: 'Already Checked In',
        alreadyCheckedIn: true,
        checkedInAt: registration.checkedInAt,
        student: registration.user
      });
    }

    // Mark attendance
    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    res.json({
      success: true,
      message: 'Attendance Marked Successfully! 🎉',
      checkedInAt: registration.checkedInAt,
      student: registration.user,
      registrationId: registration.registrationId
    });
  } catch (error) {
    console.error('[Check-In Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { checkInAttendee };
