const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initReminderCron = require('./services/reminderCron');

const User = require('./models/User');

dotenv.config();

// Connect Database & Ensure Default Admin Account
const initServer = async () => {
  await connectDB();

  // Auto-seed Admin if missing
  try {
    const adminExists = await User.findOne({ email: 'admin@eventease.com' });
    if (!adminExists) {
      await User.create({
        name: 'System Admin',
        email: 'admin@eventease.com',
        password: 'password123',
        role: 'admin',
        department: 'Administration',
        year: 'Faculty',
        phone: '9876543210',
        interests: ['Coding', 'AI/ML', 'Workshops']
      });
      console.log('[Auto-Seed]: Created default Admin account: admin@eventease.com / password123');
    }
  } catch (err) {
    console.error('[Auto-Seed Error]:', err.message);
  }
};

initServer();

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static uploads folder for posters
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EventEase Backend Server Running Cleanly 🚀' });
});

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api', require('./routes/paymentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

// Initialize node-cron automated reminders
initReminderCron();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[EventEase Server]: Listening on http://localhost:${PORT}`);
});
