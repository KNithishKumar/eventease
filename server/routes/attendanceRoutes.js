const express = require('express');
const router = express.Router();
const { checkInAttendee } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/check-in', protect, authorize('organizer', 'admin'), checkInAttendee);

module.exports = router;
