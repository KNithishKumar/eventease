const Event = require('../models/Event');
const User = require('../models/User');
const Registration = require('../models/Registration');
const Notification = require('../models/Notification');

// @desc    Get pending events awaiting admin approval
// @route   GET /api/admin/events/pending
// @access  Private (Admin)
const getPendingEvents = async (req, res) => {
  try {
    const events = await Event.find({ status: 'pending' })
      .populate('organizer', 'name email department phone')
      .sort({ createdAt: -1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve an event
// @route   PUT /api/admin/events/:id/approve
// @access  Private (Admin)
const approveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'approved';
    event.rejectionReason = '';
    await event.save();

    // Notify organizer
    await Notification.create({
      user: event.organizer,
      event: event._id,
      title: '🎉 Event Approved!',
      message: `Your event "${event.title}" has been approved by Admin and is now publicly live for student registrations.`,
      type: 'event_status'
    });

    res.json({ message: 'Event approved successfully', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject an event with reason
// @route   PUT /api/admin/events/:id/reject
// @access  Private (Admin)
const rejectEvent = async (req, res) => {
  try {
    const { rejectionReason } = req.body;

    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    event.status = 'rejected';
    event.rejectionReason = rejectionReason;
    await event.save();

    // Notify organizer
    await Notification.create({
      user: event.organizer,
      event: event._id,
      title: '⚠️ Event Registration Update',
      message: `Your event "${event.title}" was not approved. Reason: ${rejectionReason}`,
      type: 'event_status'
    });

    res.json({ message: 'Event rejected', event });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (with filtering)
// @route   GET /api/admin/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const { search, role } = req.query;

    let query = {};
    if (role && role !== 'All') {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate/Deactivate user
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin)
const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deactivated' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({
      message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Admin accounts cannot be deleted' });
    }

    // Remove user registrations
    await Registration.deleteMany({ user: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Platform Analytics for Admin Dashboard
// @route   GET /api/admin/analytics
// @access  Private (Admin)
const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalOrganizers = await User.countDocuments({ role: 'organizer' });
    const totalEvents = await Event.countDocuments();
    const approvedEvents = await Event.countDocuments({ status: 'approved' });
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const totalRegistrations = await Registration.countDocuments({ status: 'registered' });
    const totalCheckedIn = await Registration.countDocuments({ checkedIn: true });

    // Category distribution
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Department user distribution
    const departmentStats = await User.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalStudents,
      totalOrganizers,
      totalEvents,
      approvedEvents,
      pendingEvents,
      totalRegistrations,
      totalCheckedIn,
      attendanceRate: totalRegistrations > 0 ? Math.round((totalCheckedIn / totalRegistrations) * 100) : 0,
      categoryStats: categoryStats.map((c) => ({ name: c._id || 'Other', value: c.count })),
      departmentStats: departmentStats.map((d) => ({ name: d._id || 'General', value: d.count }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getPlatformAnalytics
};
