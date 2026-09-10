const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true
    },
    registrationId: {
      type: String,
      required: true,
      unique: true
    },
    qrToken: {
      type: String,
      required: true,
      unique: true
    },
    status: {
      type: String,
      enum: ['registered', 'waitlisted', 'cancelled'],
      default: 'registered'
    },
    waitlistPosition: {
      type: Number,
      default: null
    },
    checkedIn: {
      type: Boolean,
      default: false
    },
    checkedInAt: {
      type: Date,
      default: null
    },
    paymentStatus: {
      type: String,
      enum: ['free', 'paid', 'pending', 'failed'],
      default: 'free'
    },
    paymentMethod: {
      type: String,
      default: 'Free'
    },
    paymentId: {
      type: String,
      default: ''
    },
    razorpayOrderId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

registrationSchema.index({ user: 1, event: 1 });
registrationSchema.index({ event: 1, status: 1, waitlistPosition: 1 });

module.exports = mongoose.model('Registration', registrationSchema);
