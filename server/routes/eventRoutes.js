const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getOrganizerEvents
} = require('../controllers/eventController');
const {
  registerForEvent,
  getEventRegistrations
} = require('../controllers/registrationController');
const { submitFeedback, getEventFeedback } = require('../controllers/feedbackController');
const { sendAnnouncement } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/organizer/my', protect, authorize('organizer', 'admin'), getOrganizerEvents);
router.get('/:id', getEventById);

// Event CRUD
router.post('/', protect, authorize('organizer', 'admin'), upload.single('image'), createEvent);
router.put('/:id', protect, authorize('organizer', 'admin'), upload.single('image'), updateEvent);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteEvent);

// Registration & Capacity
router.post('/:id/register', protect, authorize('student'), registerForEvent);
router.get('/:id/registrations', protect, authorize('organizer', 'admin'), getEventRegistrations);

// Announcements & Feedback
router.post('/:id/announcements', protect, authorize('organizer', 'admin'), sendAnnouncement);
router.post('/:id/feedback', protect, authorize('student'), submitFeedback);
router.get('/:id/feedback', getEventFeedback);

module.exports = router;
