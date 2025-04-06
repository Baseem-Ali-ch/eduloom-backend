import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true 
  },
  category: {
    type: String,
    required: true
  },
  discount: {
    type: Number,
    required: true 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true 
});

export const Offer = mongoose.model('Offer', offerSchema);