const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add an event description']
    },
    image: {
      type: String,
      default: '/uploads/default-event.jpg'
    },
    category: {
      type: String,
      required: [true, 'Please specify category'],
      enum: [
        'Technical',
        'Cultural',
        'Sports',
        'Workshop',
        'Seminar',
        'Hackathon',
        'Competition',
        'Club Event',
        'Other'
      ]
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    venue: {
      type: String,
      required: [true, 'Please specify event venue']
    },
    date: {
      type: Date,
      required: [true, 'Please specify event date']
    },
    startTime: {
      type: String,
      required: [true, 'Please specify start time']
    },
    endTime: {
      type: String,
      required: [true, 'Please specify end time']
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Please specify registration deadline']
    },
    capacity: {
      type: Number,
      required: [true, 'Please specify event capacity'],
      min: [1, 'Capacity must be at least 1']
    },
    eventType: {
      type: String,
      enum: ['Free', 'Paid'],
      default: 'Free'
    },
    registrationFee: {
      type: Number,
      default: 0
    },
    eligibility: {
      type: String,
      default: 'All Students'
    },
    department: {
      type: String,
      default: 'All Departments'
    },
    rules: {
      type: String,
      default: 'Standard college guidelines apply.'
    },
    contact: {
      type: String,
      required: [true, 'Please provide contact information']
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    upiId: {
      type: String,
      default: ''
    },
    bankName: {
      type: String,
      default: ''
    },
    bankAccountNumber: {
      type: String,
      default: ''
    },
    bankIfsc: {
      type: String,
      default: ''
    },
    accountHolderName: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

eventSchema.index({ title: 'text', description: 'text', category: 1, date: 1, status: 1 });

module.exports = mongoose.model('Event', eventSchema);
