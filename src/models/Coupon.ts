const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: {
    type: String,
    required: true,
    unique: true,  // Added unique constraint
    trim: true
  },
  discount: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  expDate: {
    type: String,
    required: true,
  },
  minPurAmt: {
    type: Number,
    required: true,
  },
  maxPurAmt: {
    type: Number,
  },
  usedUsers: [{ 
    type: String,
    default: []
  }],
  isActive: {
    type: Boolean,
    default: true,  // Fixed from 'active' to true
  },
}, {
  timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);