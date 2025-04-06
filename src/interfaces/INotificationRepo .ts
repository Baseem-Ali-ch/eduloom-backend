// INotificationRepo.ts
import { ObjectId } from 'mongoose';

export interface INotificationRepo {
  find(): Promise<any>;
  findByIdAndUpdate(id: string, status: boolean): Promise<any>;
  findById(userId: ObjectId): Promise<any>;
}
