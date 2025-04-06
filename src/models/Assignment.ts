import mongoose from 'mongoose'
import { IAssignment } from '../interfaces/ICourse';

const assignmentSchema = new mongoose.Schema<IAssignment>(
  {
    courseId: {
      type: String,
      required: true,
    },
    assignmentId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

export const Assignment = mongoose.model('Assignment', assignmentSchema)
