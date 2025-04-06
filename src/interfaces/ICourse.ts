export interface ICoupon {
  _id?: string;
  couponCode: string;
  discount: number;
  description: string;
  expDate: string;
  minPurAmt: number;
  maxPurAmt: number;
  isActive: boolean;
}

export interface IOffer {
  _id?: string;
  title: string;
  description: string;
  discount: number;
  isActive: boolean;
}

export interface IAssignment {
  courseId: string;
  assignmentId: string;
  studentId: string;
  link: string;
}
export interface IQuizSubmission {
  courseId: string;
  quizId: string;
  studentId: string;
  answers: { [questionId: string]: string };
  results: { correct: number; wrong: number; skipped: number };
  submittedAt: Date;
}
