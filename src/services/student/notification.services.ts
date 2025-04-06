import { ObjectId } from 'mongoose';
import { NotificationRepo } from 'src/repo/student/notification.repo';
import { EmailService } from './email.services';
import { INotificationService } from '../../interfaces/IUser';

export class NotificationService implements INotificationService{
  private _notificationRepository: NotificationRepo;
  private _emailService: EmailService;

  constructor(notificationRepository: NotificationRepo, emailService: EmailService) {
    this._notificationRepository = notificationRepository;
    this._emailService = emailService;
  }

  // get all user details
  async getNotification() {
    const notification = await this._notificationRepository.find();
    return notification;
  }

  // update notification status
  async updateNotification(id: string, status: boolean) {
    const notification = await this._notificationRepository.findByIdAndUpdate(id, status);
    return notification;
  }

  async sendNotificationMail(userId: ObjectId | string, message: string) {
    const user = await this._notificationRepository.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    await this._emailService.sendNotificationEmail(user, message);
  }
}
