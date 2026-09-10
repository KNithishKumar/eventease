const Notification = require('../models/Notification');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate('event', 'title image category venue date')
      .sort({ createdAt: -1 });

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send announcement to all event attendees (Organizer)
// @route   POST /api/events/:id/announcements
// @access  Private (Organizer)
const sendAnnouncement = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Find all registered & waitlisted users
    const registrations = await Registration.find({
      event: eventId,
      status: { $in: ['registered', 'waitlisted'] }
    });

    const notifDocs = registrations.map((reg) => ({
      user: reg.user,
      event: eventId,
      title: `📢 ${title}`,
      message,
      type: 'announcement'
    }));

    await Notification.insertMany(notifDocs);

    res.status(201).json({
      message: `Announcement broadcasted to ${notifDocs.length} attendees!`
    });
  } catch (error) {
    console.error('[Send Announcement Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  sendAnnouncement
};
