import mongoose from "mongoose";
import { IInstructor } from "src/interfaces/IInstructor";

const InstructorSchema = new mongoose.Schema<IInstructor>(
  {
    userName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    workExperience: {
      type: String,
      required: true,
    },
    lastWorkingPlace: {
      type: String,
      required: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    profilePhoto: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Instructor = mongoose.model<IInstructor>("Instructor", InstructorSchema);
