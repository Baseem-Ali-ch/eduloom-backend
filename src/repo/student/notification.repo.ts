import { User } from '../../models/User';
import { Notification } from '../../models/Notification';
import { ObjectId } from 'mongoose';
import { INotificationRepo } from '../../interfaces/INotificationRepo ';

export class NotificationRepo implements INotificationRepo {
  async find(): Promise<any> {
    return await Notification.find().sort({ createdAt: -1 });
  }

  async findByIdAndUpdate(id: string, status: boolean): Promise<any> {
    try {
      return await Notification.findByIdAndUpdate(id, { status }, { new: true });
    } catch (error) {
      console.error('Error find notification', error);
    }
  }

  async findById(userId: ObjectId | string): Promise<any> {
    try {
      return await User.findById(userId);
    } catch (error) {
      console.error('Error find id', error);
    }
  }
}
