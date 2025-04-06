import { ObjectId } from 'mongoose';
import { IInstructor } from './IInstructor';

export interface IUser {
  _id?: ObjectId;
  userName: string;
  email: string;
  password: string;
  phone?: string;
  profilePhoto?: string;
  googleId?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isAdmin?: boolean;
}

export interface INotification {
  userId: ObjectId
  title: string
  message: string
  description: string
  status: string
}


export interface OTPDetails {
  code: string;
  expiresAt: Date;
}

export interface GoogleUser {
  _id?: ObjectId;
  userName?: string;
  email?: string;
  password?: string;
  phone?: string;
  profilePhoto?: string;
  googleId?: string;
  isVerified?: boolean;
  isActive?: boolean;
  isAdmin?: boolean;
}

export interface IUserRepo {
  findByEmail(email: string): Promise<IUser | null>;
  passwordCompare(password: string, hashedPassword: string): Promise<boolean>;
  createUser(userData: IUser): Promise<IUser | null>;
  createGoogleUser(userData: GoogleUser): Promise<GoogleUser | null>;
  updateGoogleUser(user: GoogleUser): Promise<GoogleUser | null>;
  updatePassword(user: IUser, password: string): Promise<any>;
  updateUser(user: IUser): Promise<IUser | null>;
  findById(userId: ObjectId): Promise<IUser | null>;
  findStatus(user: IUser): Promise<IUser | null>;
  create(entity: IUser): Promise<IUser | null>;

}

export interface IAuthService {
  register(userData: IUser): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ token: string; user: { id: string; email: string; username: string } }>;
  resendOTP(email: string): Promise<{ message: string }>;
  login(email: string, password: string): Promise<{ token: string; user: { id: string; email: string; username: string } }>;
  forgetPassword(email: string): Promise<{ message: string }>;
  resetPassword(token: string, password: string): Promise<{ message: string }>;
  googleAuth(token: string): Promise<{ token: string; user: GoogleUser }>;
}

export interface IEmailService {
  sendOTPEmail(email: string, otp: string): Promise<void>;
  sendPasswordResetEmail(email: string, resetLink: string): Promise<void>;
  sendNotificationEmail(user: IUser, message: string): Promise<void>;
}

export interface INotificationService {
  getNotification(): Promise<any>;
  updateNotification(id: string, status: boolean): Promise<any | null>;
  sendNotificationMail(userId: ObjectId, message: string): Promise<void>;
}

export interface IOTPService {
  generateOTP(length?: number): string;
  validateOTPExpiry(expiresAt: Date): boolean;
}

export interface IProfileService {
  userDetails(userId: ObjectId): Promise<any>;
  updateUserDetails(userId: ObjectId, userName: string, phone: string): Promise<any>;
  changePassword(userId: ObjectId, currentPassword: string, newPassword: string): Promise<any>;
  instructorReq(data: IInstructor, userId: ObjectId): Promise<void>;
}

export interface IInstructorRepoStudent {
  findById(id: ObjectId): Promise<IUser | null>;
  createNotification(notificationData: any): Promise<any>;
  createInstructor(instructorData: any): Promise<any>;
  createUser(userData: IUser): Promise<IUser | null>;
}
