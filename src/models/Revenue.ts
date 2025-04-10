import mongoose from 'mongoose';

const revenueSchema = new mongoose.Schema({
  enrollment: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' }],
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor' },
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instructorShare: Number,
  adminShare: Number,
  date: { type: Date, default: Date.now },
  insWithdrawn: { type: Boolean, default: false },
  admWithdrawn: { type: Boolean, default: false },
});

export const Revenue = mongoose.model('Revenue', revenueSchema);
