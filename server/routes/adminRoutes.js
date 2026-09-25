const express = require('express');
const router = express.Router();
const {
  getPendingEvents,
  approveEvent,
  rejectEvent,
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getPlatformAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.get('/events/pending', getPendingEvents);
router.put('/events/:id/approve', approveEvent);
router.put('/events/:id/reject', rejectEvent);

router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.delete('/users/:id', deleteUser);

router.get('/analytics', getPlatformAnalytics);

module.exports = router;
