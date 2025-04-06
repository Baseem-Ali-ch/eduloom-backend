import mongoose from 'mongoose';
import { IQuizSubmission } from 'src/interfaces/ICourse';

const quizSubmissionSchema = new mongoose.Schema<IQuizSubmission>(
  {
    courseId: {
      type: String,
      required: true,
    },
    quizId: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
      required: true,
    },
    answers: {
      type: Map,
      of: String,
      required: true,
    },
    results: {
      correct: {
        type: Number,
      },
      wrong: {
        type: Number,
      },
      skipped: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const Quiz = mongoose.model('Quiz', quizSubmissionSchema);
