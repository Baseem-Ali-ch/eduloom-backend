import { ICourse } from 'src/interfaces/IInstructor';

import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  document: { type: String },
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const AssignmentSchema = new mongoose.Schema({
  assignmentTitle: { type: String, required: true },
  assignmentDescription: { type: String, required: true },
});

const QuizOptionSchema = new mongoose.Schema({
  optionText: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
});

const QuizQuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [QuizOptionSchema],
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [QuizQuestionSchema],
});

const LiveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  scheduleDate: { type: Date, required: true },
  duration: { type: String, required: true }, // Minutes
  meetingLink: { type: String, required: true },
});

const EnrolledStudentsSchema = new mongoose.Schema({
  studentId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' 
  }],});

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficultyLevel: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    offer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Offer',
    },
    modules: [ModuleSchema],
    assignments: [AssignmentSchema],
    quizzes: [QuizSchema],
    liveClasses: [LiveClassSchema],
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
    },
    isActive: {
      type: Boolean,
      defauld: true,
    },
    status: { 
      type: String, 
      enum: ['draft', 'published'], 
      default: 'draft' 
    },
    enrolledStudents: [EnrolledStudentsSchema],
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model<ICourse>('Course', CourseSchema);
