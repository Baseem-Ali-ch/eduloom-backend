import mongoose from 'mongoose';
import { IAnnountment } from 'src/interfaces/IInstructor';

const announcementSchema = new mongoose.Schema<IAnnountment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructorId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Announcement = mongoose.model('Announcement', announcementSchema);
