import { Instructor } from '../../models/Instructor';
import { Notification } from '../../models/Notification';
import { BaseRepository } from '../base.repo';
import { IInstructor } from '../../interfaces/IInstructor';
import { INotification } from '../../interfaces/IUser';

export class InstructorRepo extends BaseRepository<IInstructor> {
  constructor() {
    super(Instructor);
  }

  // async findById(id: ObjectId) {
  //   return await User.findById(id);
  // }

  async createNotification(notificationData: INotification) {
    try {
      const notification = new Notification(notificationData);
      return await notification.save();
    } catch (error) {
      console.error('Error create notificatino', error);
      return false;
    }
  }

  // async createInstructor(instructorData: any) {
  //   const instructor = new Instructor(instructorData);
  //   return await instructor.save();
  // }

  // async createUser(userData: IUser): Promise<IUser | null> {
  //   const salt = await bcrypt.genSalt(10);
  //   userData.password = await bcrypt.hash(userData.password, salt);
  //   const newUser = new User(userData);
  //   return await newUser.save();
  // }
}
