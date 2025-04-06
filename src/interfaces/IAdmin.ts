import { IUser } from './IUser';
import { IInstructor } from './IInstructor';

export interface IAdminRepo {
  findByEmail(email: string): Promise<IUser | null>;
  passwordCompare(password: string, hashedPassword: string): Promise<boolean>;
  updatePassword(user: IUser, password: string): Promise<any>;
  updateUser(user: IUser): Promise<IUser | null>;
  findById(adminId: string): Promise<IUser | null>;
  findUser(limit: number, skip: number): Promise<IUser[]>;
  findTotalUsers(): Promise<number>;
  findInstructor(): Promise<any>;
  findByIdAndUpdate(userId: string, status: boolean): Promise<IUser | null>;
  findByIdAndUpdateIns(instructorId: string, status: boolean): Promise<any>;
}

export interface IInstructorMangeService {
  allinstructorDetails(): Promise<IInstructor[]>;
  changeStatus(instructorId: string, status: boolean): Promise<IInstructor | null>;
}

export interface IProfileService {
  adminDetails(adminId: string): Promise<IUser | null>;
  updateAdminDetails(adminId: string, userName: string, phone: string): Promise<IUser | null>;
  changePassword(adminId: string, oldPassword: string, newPassword: string): Promise<any>;
}

export interface IUserManageService {
  allUserDetails(limit: number, skip: number): Promise<{ allUsers: IUser[]; totalUsers: number }>;
  changeStatus(userId: string, status: boolean): Promise<IUser | null>;
}

// export interface ICourseManageService{
//   getOffers(): Promise<IOffer[]>
//   addOffer(offerData: IOffer):Promise<IOffer>
//   changeStatus(userId: string, status: boolean): Promise<>
// }

