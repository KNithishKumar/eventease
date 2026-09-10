const Feedback = require('../models/Feedback');
const Registration = require('../models/Registration');
const Event = require('../models/Event');

// @desc    Submit feedback for completed event
// @route   POST /api/events/:id/feedback
// @access  Private (Student)
const submitFeedback = async (req, res) => {
  try {
    const eventId = req.params.id;
    const userId = req.user._id;
    const { rating, organizationRating, contentRating, venueRating, comment } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Verify registration/attendance
    const registration = await Registration.findOne({
      user: userId,
      event: eventId,
      status: 'registered'
    });

    if (!registration) {
      return res.status(403).json({
        message: 'Only registered attendees can submit feedback for this event'
      });
    }

    // Prevent duplicate feedback
    const existingFeedback = await Feedback.findOne({ user: userId, event: eventId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'You have already submitted feedback for this event' });
    }

    const feedback = await Feedback.create({
      user: userId,
      event: eventId,
      rating: Number(rating),
      organizationRating: Number(organizationRating || rating),
      contentRating: Number(contentRating || rating),
      venueRating: Number(venueRating || rating),
      comment: comment || ''
    });

    res.status(201).json({
      message: 'Feedback submitted successfully! Thank you.',
      feedback
    });
  } catch (error) {
    console.error('[Feedback Submit Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get feedback and rating statistics for an event
// @route   GET /api/events/:id/feedback
// @access  Public
const getEventFeedback = async (req, res) => {
  try {
    const eventId = req.params.id;

    const feedbacks = await Feedback.find({ event: eventId })
      .populate('user', 'name department year')
      .sort({ createdAt: -1 });

    if (feedbacks.length === 0) {
      return res.json({
        averageRating: 0,
        averageOrgRating: 0,
        averageContentRating: 0,
        averageVenueRating: 0,
        totalReviews: 0,
        feedbacks: []
      });
    }

    const total = feedbacks.length;
    const avgRating = feedbacks.reduce((acc, item) => acc + item.rating, 0) / total;
    const avgOrg = feedbacks.reduce((acc, item) => acc + item.organizationRating, 0) / total;
    const avgContent = feedbacks.reduce((acc, item) => acc + item.contentRating, 0) / total;
    const avgVenue = feedbacks.reduce((acc, item) => acc + item.venueRating, 0) / total;

    res.json({
      averageRating: parseFloat(avgRating.toFixed(1)),
      averageOrgRating: parseFloat(avgOrg.toFixed(1)),
      averageContentRating: parseFloat(avgContent.toFixed(1)),
      averageVenueRating: parseFloat(avgVenue.toFixed(1)),
      totalReviews: total,
      feedbacks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getEventFeedback
};
