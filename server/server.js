const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const initReminderCron = require('./services/reminderCron');
const User = require('./models/User');

dotenv.config();

const app = express();

// CORS: allow local dev and deployed Vercel frontend
const rawOrigins = [
  'http://localhost:5173',
  'https://eventeasewa.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

const allowedOrigins = rawOrigins.map(o => o.startsWith('http') ? o : 'https://' + o);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS: origin not allowed - ' + origin));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EventEase Backend Running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(notFound);
app.use(errorHandler);

(async () => {
  try {
    await connectDB();

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
      console.log('[Auto-Seed]: Created default Admin account');
    }

    initReminderCron();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log('[EventEase Server]: Listening on port ' + PORT);
    });
  } catch (err) {
    console.error('[Startup Error]:', err.message);
    process.exit(1);
  }
})();

module.exports = app;
