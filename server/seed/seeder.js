const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventease');
    console.log('[Seeder]: Connected to MongoDB');
  } catch (err) {
    console.error('[Seeder DB Error]:', err.message);
    process.exit(1);
  }
};

const seedData = async () => {
  await connectDB();

  try {
    console.log('[Seeder]: Clearing existing collections...');
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    await Feedback.deleteMany();
    await Notification.deleteMany();

    console.log('[Seeder]: Creating demo users...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@eventease.com',
      password: 'password123',
      role: 'admin',
      department: 'Administration',
      year: 'Faculty',
      phone: '9876543210',
      interests: ['Coding', 'AI/ML', 'Workshops']
    });

    const organizer = await User.create({
      name: 'Sarah Jenkins (CSE Club Lead)',
      email: 'organizer@eventease.com',
      password: 'password123',
      role: 'organizer',
      department: 'Computer Science',
      year: '4th Year',
      phone: '9876543211',
      interests: ['Coding', 'Hackathon', 'Web Development']
    });

    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'student1@eventease.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      year: '3rd Year',
      phone: '9876543212',
      interests: ['Coding', 'AI/ML', 'Web Development', 'Hackathon']
    });

    const student2 = await User.create({
      name: 'Maya Patel',
      email: 'student2@eventease.com',
      password: 'password123',
      role: 'student',
      department: 'Electrical Engineering',
      year: '2nd Year',
      phone: '9876543213',
      interests: ['Robotics', 'Workshops', 'Cultural', 'Sports']
    });

    console.log('[Seeder]: Creating sample events...');
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const inTwoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const event1 = await Event.create({
      title: 'CodeSprint 2026',
      description: 'Annual 24-hour college hackathon! Build real-world apps, compete for prize pools up to ₹50,000, and connect with top tech recruiters.',
      image: '/uploads/default-event.jpg',
      category: 'Hackathon',
      organizer: organizer._id,
      venue: 'CEG Campus Auditorium & Innovation Lab',
      date: nextWeek,
      startTime: '09:00 AM',
      endTime: '09:00 AM (Next Day)',
      registrationDeadline: new Date(nextWeek.getTime() - 24 * 60 * 60 * 1000),
      capacity: 100,
      eventType: 'Free',
      registrationFee: 0,
      eligibility: 'Open to all CSE, IT, and ECE undergraduate students.',
      department: 'Computer Science',
      rules: 'Teams of 2-4. Original code created during hackathon timeframe only.',
      contact: 'codesprint@eventease.edu | +91 98765 43211',
      status: 'approved'
    });

    const event2 = await Event.create({
      title: 'Generative AI & LLM Masterclass',
      description: 'Hands-on workshop exploring PyTorch, Transformer architectures, LangChain, and deploying custom AI agents.',
      image: '/uploads/default-event.jpg',
      category: 'Workshop',
      organizer: organizer._id,
      venue: 'Turing Auditorium - Hall B',
      date: inTwoWeeks,
      startTime: '02:00 PM',
      endTime: '05:00 PM',
      registrationDeadline: new Date(inTwoWeeks.getTime() - 24 * 60 * 60 * 1000),
      capacity: 50,
      eventType: 'Paid',
      registrationFee: 150,
      eligibility: 'All college students with basic Python knowledge.',
      department: 'Computer Science',
      rules: 'Laptops required with Python 3.10+ pre-installed.',
      contact: 'ai-club@eventease.edu',
      status: 'approved'
    });

    const event3 = await Event.create({
      title: 'Inter-College Robotics Expo 2026',
      description: 'RoboWars, Line Follower challenge, and Autonomous Drone navigation competitions!',
      image: '/uploads/default-event.jpg',
      category: 'Technical',
      organizer: organizer._id,
      venue: 'Robotics Center Lab 302',
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      registrationDeadline: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      capacity: 60,
      eventType: 'Free',
      registrationFee: 0,
      eligibility: 'All Engineering students',
      department: 'Electrical Engineering',
      rules: 'Safety goggles required during RoboWars arena.',
      contact: 'robotics@eventease.edu',
      status: 'approved'
    });

    const event4 = await Event.create({
      title: 'Spring Cultural Night & Music Fest',
      description: 'Live band performances, solo dance face-offs, drama acts, and food stalls across the central courtyard!',
      image: '/uploads/default-event.jpg',
      category: 'Cultural',
      organizer: organizer._id,
      venue: 'Open Air Theatre (OAT)',
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      startTime: '06:00 PM',
      endTime: '10:00 PM',
      registrationDeadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      capacity: 300,
      eventType: 'Free',
      registrationFee: 0,
      eligibility: 'All students & staff',
      department: 'All Departments',
      rules: 'Valid College ID mandatory at entry gates.',
      contact: 'cultural@eventease.edu',
      status: 'approved'
    });

    const eventPending = await Event.create({
      title: 'CyberSecurity CTF Challenge 2026',
      description: 'Jeopardy-style Capture The Flag tournament covering Reverse Engineering, Web Exploitation, and Cryptography.',
      image: '/uploads/default-event.jpg',
      category: 'Competition',
      organizer: organizer._id,
      venue: 'Cyber Security Lab 101',
      date: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      registrationDeadline: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      capacity: 40,
      eventType: 'Free',
      registrationFee: 0,
      eligibility: 'CSE & IT department students',
      department: 'Computer Science',
      rules: 'Ethical hacking guidelines strictly enforced.',
      contact: 'ctf@eventease.edu',
      status: 'pending' // Awaiting admin approval
    });

    const eventCompleted = await Event.create({
      title: 'Campus Startup Pitch Night',
      description: 'Student founders pitch venture ideas to alumni angel investors for seed funding grants.',
      image: '/uploads/default-event.jpg',
      category: 'Seminar',
      organizer: organizer._id,
      venue: 'Entrepreneurship Cell Hall A',
      date: yesterday,
      startTime: '03:00 PM',
      endTime: '06:00 PM',
      registrationDeadline: new Date(yesterday.getTime() - 24 * 60 * 60 * 1000),
      capacity: 80,
      eventType: 'Free',
      registrationFee: 0,
      eligibility: 'All students',
      department: 'All Departments',
      rules: 'Pitch length 5 minutes + 3 mins Q&A.',
      contact: 'ecell@eventease.edu',
      status: 'approved'
    });

    console.log('[Seeder]: Creating sample registration for Student 1...');
    const reg1 = await Registration.create({
      user: student1._id,
      event: event1._id,
      registrationId: 'REG-8820-1001',
      qrToken: 'demo_qr_token_alex_codesprint_2026',
      status: 'registered',
      checkedIn: false
    });

    // Sample registration for completed event + feedback
    const reg2 = await Registration.create({
      user: student1._id,
      event: eventCompleted._id,
      registrationId: 'REG-8820-1002',
      qrToken: 'demo_qr_token_alex_pitch_night',
      status: 'registered',
      checkedIn: true,
      checkedInAt: yesterday
    });

    await Feedback.create({
      user: student1._id,
      event: eventCompleted._id,
      rating: 5,
      organizationRating: 5,
      contentRating: 5,
      venueRating: 4,
      comment: 'Fantastic pitch night! Great feedback from the investor panel.'
    });

    console.log('[Seeder]: Sample notifications...');
    await Notification.create({
      user: student1._id,
      event: event1._id,
      title: '🎉 Welcome to EventEase!',
      message: 'You have registered for CodeSprint 2026. View your digital ticket in My Events.',
      type: 'system'
    });

    console.log('----------------------------------------------------');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Account Credentials:');
    console.log('1. Admin:     admin@eventease.com     / password123');
    console.log('2. Organizer: organizer@eventease.com / password123');
    console.log('3. Student 1: student1@eventease.com  / password123');
    console.log('4. Student 2: student2@eventease.com  / password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
