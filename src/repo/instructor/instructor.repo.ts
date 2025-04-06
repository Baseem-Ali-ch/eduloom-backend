import bcrypt from 'bcrypt';
import { Instructor } from '../../models/Instructor';
import { IInstructor } from '../../interfaces/IInstructor';
import { BaseRepository } from '../base.repo';
import { Revenue } from '../../models/Revenue';
import { Course } from '../../models/Course';
import mongoose from 'mongoose';

export class InstructorRepo extends BaseRepository<IInstructor> {
  constructor() {
    super(Instructor);
  }

  async findByEmail(email: string): Promise<IInstructor | null> {
    try {
      return await Instructor.findOne({ email });
    } catch (error) {
      console.error('Error find instructor', error);
      return null;
    }
  }

  async passwordCompare(password: string, hashedPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error compare password', error);
      return false;
    }
  }

  // async createUser(instructorData: IInstructor): Promise<IInstructor | null> {
  //   const salt = await bcrypt.genSalt(10);
  //   instructorData.password = await bcrypt.hash(instructorData.password, salt);
  //   const newInstructor = new Instructor(instructorData);
  //   return await newInstructor.save();
  // }

  async updatePassword(instructor: IInstructor, password: string): Promise<any> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      return await Instructor.updateOne({ email: instructor.email }, { password: hashedPassword });
    } catch (error) {
      console.error('Error update password', error);
    }
  }

  // async update(instructor: any): Promise<IInstructor | null> {
  //   return await Instructor.findByIdAndUpdate(instructor._id, instructor, { new: true });
  // }

  // async findById(userId: string): Promise<IInstructor | null> {
  //   return await Instructor.findById(userId);
  // }

  async findStatus(instructor: IInstructor): Promise<IInstructor | null> {
    try {
      return await Instructor.findOne({ email: instructor.email, isActive: instructor.isActive === true });
    } catch (error) {
      console.error('Error find status', error);
      return null;
    }
  }

  async findRevenues() {
    try {
      return await Revenue.find().exec();
    } catch (error) {
      console.log('error find revenues', error);
      return null;
    }
  }

  async findCourse(enrollmentId: string) {
    try {
      return await Course.findOne({ 'enrolledStudents._id': enrollmentId }).select('title price').populate({
        path: 'enrolledStudents.studentId',
        select: 'userName',
      });
    } catch (error) {
      console.log('error find course', error);
      return null;
    }
  }

  async updateMany(instructorId: string) {
    try {
      const result = await Revenue.updateMany({ instructor: new mongoose.Types.ObjectId(instructorId), insWithdrawn: false }, { $set: { insWithdrawn: true } });
      console.log('ins',result);

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateManyAdm(instructorId: string) {
    try {
      const result = await Revenue.updateMany({ instructor: new mongoose.Types.ObjectId(instructorId), admWithdrawn: false }, { $set: { admWithdrawn: true } });
      console.log('admin',result);
      return result;
    } catch (error) {
      console.log('error update revenue', error);
      throw error;
    }
  }
}
