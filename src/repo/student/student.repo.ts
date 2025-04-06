import { GoogleUser, IUser } from '../../interfaces/IUser';
import { User } from '../../models/User';
import bcrypt from 'bcrypt';
import { BaseRepository } from '../base.repo';

export class UserRepo extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email });
    } catch (error) {
      console.error('Error fetch user', error);
      return null;
    }
  }

  async passwordCompare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error password compare', error);
      return false;
    }
  }

  // async createUser(userData: IUser): Promise<IUser | null> {
  //   const salt = await bcrypt.genSalt(10);
  //   userData.password = await bcrypt.hash(userData.password, salt);
  //   const newUser = new User(userData);
  //   return await newUser.save();
  // }

  async createGoogleUser(userData: GoogleUser): Promise<GoogleUser | null> {
    try {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password as string, salt);
      const newUser = new User(userData);
      return await newUser.save();
    } catch (error) {
      console.error('Error create google user', error);
      return null;
    }
  }

  async updateGoogleUser(user: GoogleUser): Promise<GoogleUser | null> {
    try {
      return await User.findByIdAndUpdate(user._id, user, { new: true });
    } catch (error) {
      console.error('Error update user', error);
      return null;
    }
  }

  async updatePassword(user: IUser, password: string): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await User.updateOne({ email: user.email }, { password: hashedPassword });
    } catch (error) {
      console.error('Error compare password', error);
    }
  }

  // async updateUser(user: IUser): Promise<IUser | null> {
  //   return await User.findByIdAndUpdate(user._id, user, { new: true });
  // }

  // async findById(userId: ObjectId): Promise<IUser | null> {
  //   return await User.findById(userId);
  // }

  async findStatus(user: IUser): Promise<IUser | null> {
    try {
      return await User.findOne({ email: user.email, isActive: user.isActive === true });
    } catch (error) {
      console.error('Error find status', error);
      return null;
    }
  }
}
