import { Instructor } from '../../models/Instructor';
import { IUser } from '../../interfaces/IUser';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import { BaseRepository } from '../base.repo';

export class AdminRepo extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Cant fetch', error);
      throw new Error('Cant fetch user');
    }
  }

  async passwordCompare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      return false;
    }
  }

  async updatePassword(user: IUser, password: string): Promise<any> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      return await User.updateOne({ email: user.email }, { password: hashedPassword });
    } catch (error) {
      console.error('Error update password');
      throw new Error('Error update password');
    }
  }

  async updateUser(user: IUser): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(user._id, user, { new: true });
    } catch (error) {
      console.error('Error update user', error);
      return null;
    }
  }

  // async findById(adminId: string): Promise<IUser | null> {
  //   return await User.findById(adminId);
  // }

  async findUser(limit: number, skip: number): Promise<any> {
    try {
      return await User.find().skip(skip).limit(limit);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Could not fetch users');
    }
  }

  async findTotalUsers(): Promise<number> {
    try {
      return await User.countDocuments();
    } catch (error) {
      console.error('Error find user', error);
      return 0;
    }
  }

  async findInstructor(): Promise<any> {
    try {
      return await Instructor.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error find instructor', error);
    }
  }

  // async findByIdAndUpdate(userId: string, status: boolean): Promise<any> {
  //   return await User.findByIdAndUpdate(userId, { isActive: status }, { new: true });
  // }

  // async findByIdAndUpdateIns(instructorId: string, status: boolean): Promise<any> {
  //   return await Instructor.findByIdAndUpdate(instructorId, { isActive: status }, { new: true });
  // }
}
