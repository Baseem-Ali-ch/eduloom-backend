// src/models/user.model.ts
import mongoose from 'mongoose';
import { IUser } from 'src/interfaces/IUser';

const userSchema = new mongoose.Schema<IUser>({
  userName: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: true
  },
  phone:{
    type:String,
  },
  profilePhoto: {
    type: String
  },
  googleId: {
    type: String
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
}, {
  timestamps: true
});

export const User = mongoose.model<IUser>('User', userSchema);