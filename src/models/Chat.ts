// models/ChatRoom.model.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  sender: string;
  message: string;
  timestamp: Date;
}

export interface IChatRoom extends Document {
  chatRoomId: string;
  participants: string[];
  messages: IMessage[];
  lastUpdated: Date;
}

const MessageSchema = new Schema({
  sender: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const ChatRoomSchema: Schema = new Schema({
  chatRoomId: { type: String, required: true, unique: true, index: true },
  participants: [{ type: String, required: true }],
  messages: [MessageSchema],
  lastUpdated: { type: Date, default: Date.now }
});

// Add index for faster querying
ChatRoomSchema.index({ lastUpdated: -1 });

export default mongoose.model<IChatRoom>('ChatRoom', ChatRoomSchema);