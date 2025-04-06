import { ObjectId } from 'mongoose';

export interface IInstructor {
  _id?: ObjectId;
  userName: string;
  userId?: ObjectId;
  email?: string;
  phone?: string;
  country?: string;
  state?: string;
  qualification?: string;
  workExperience?: string;
  lastWorkingPlace?: string;
  specialization?: string;
  password?: string;
  isActive?: boolean;
  isVerified?: boolean;
  profilePhoto?: string;
}

export interface Lesson {
  title: string;
  content: string;
  document?: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
}

export interface Assignment {
  assignmentTitle: string;
  assignmentDescription: string;
}

export interface QuizOption {
  optionText: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  questionText: string;
  options: QuizOption[];
}

export interface Quiz {
  title: string;
  questions: QuizQuestion[];
}

export interface LiveClass {
  title: string;
  scheduleDate: string;
  duration: string;
  meetingLink: string;
  description: string;
}

export interface EnrollesStudents{
  _id?: string
  studentId: string
}

export interface ICourse {
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  price: number;
  modules: Module[];
  assignments: Assignment[];
  quizzes: Quiz[];
  liveClasses: LiveClass[];
  instructorId: ObjectId | null;
  status: 'draft' | 'published';
  offer: ObjectId | null;
  coupon: ObjectId | null;
  enrolledStudents?: EnrollesStudents[]
}

export interface IAnnountment{
  instructorId: string
  title: string
  description: string
}

export interface IInstructorAuthService {
  register(email: string, password: string): Promise<{ message: string; token: string; instructor: { id: string; email: string; userName: string } }>;
  login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; username: string } }>;
  forgetPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, password: string): Promise<{ message: string }>;
}

export interface IInstructorProfileService {
  instructorDetails(userId: string): Promise<IInstructor | null>;
  updateInstructor(instructorId: string, updateData: Partial<IInstructor>): Promise<IInstructor | null>;
  changePassword(userId: string, currentPassword: string, newPassword: string): Promise<any>;
}

export interface IInstructorRepo {
  findByEmail(email: string): Promise<IInstructor | null>;
  passwordCompare(password: string, hashedPassword: string): Promise<boolean>;
  updatePassword(instructor: IInstructor, password: string): Promise<any>;
  update(instructor: IInstructor): Promise<IInstructor | null>;
  findById(userId: string): Promise<IInstructor | null>;
  findStatus(instructor: IInstructor): Promise<IInstructor | null>;
}
