import { GoogleUser , IUser } from '../interfaces/IUser';
import { ObjectId } from 'mongoose';

export interface IUserRepo {
  findByEmail(email: string): Promise<IUser  | null>;
  passwordCompare(password: string, hashedPassword: string): Promise<boolean>;
  createUser (userData: IUser): Promise<IUser  | null>;
  createGoogleUser (userData: GoogleUser ): Promise<GoogleUser  | null>;
  updateGoogleUser (user: GoogleUser ): Promise<GoogleUser  | null>;
  updatePassword(user: IUser, password: string): Promise<any>;
  updateUser (user: IUser): Promise<IUser  | null>;
  findById(userId: ObjectId): Promise<IUser  | null>;
  findStatus(user: IUser): Promise<IUser  | null>;
}


export interface IProfileRepository {
  uploadProfilePhoto(userId: string, file: any): Promise<string>;
  updateUserProfileUrl(userId: string, photoUrl: string): Promise<IUser>;
}