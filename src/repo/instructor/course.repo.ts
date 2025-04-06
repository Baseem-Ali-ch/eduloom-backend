import { Course } from '../../models/Course';
import { IAnnountment, ICourse } from '../../interfaces/IInstructor';
import { BaseRepository } from '../base.repo';
import { Assignment } from '../../models/Assignment';
import { IAssignment, IQuizSubmission } from '../../interfaces/ICourse';
import { Quiz } from '../../models/Quiz';
import { Coupon } from '../../models/Coupon';
import { User } from '../../models/User';
import { ObjectId } from 'mongoose';
import { Announcement } from '../../models/Announcement';

export class CourseRepo extends BaseRepository<ICourse> {
  constructor() {
    super(Course);
  }

  async findAllCourse(): Promise<ICourse[]> {
    try {
      return Course.find();
    } catch (error) {
      console.error('Error updating find course:', error);
      throw new Error('Failed to find course');
    }
  }

  async updateCourse(courseId: string, courseData: Partial<ICourse>): Promise<ICourse | null> {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(courseId, { $set: courseData }, { new: true, runValidators: true }).exec();
      return updatedCourse;
    } catch (error) {
      console.error('Error updating course:', error);
      throw new Error('Failed to update course');
    }
  }

  async findByInstructorAndStatus(instructorId: ObjectId, status: string): Promise<any> {
    return await Course.find({ instructorId, status }).exec();
  }

  async createAssignment(submissionData: IAssignment): Promise<IAssignment> {
    try {
      const submission = new Assignment(submissionData);
      return await submission.save();
    } catch (error) {
      console.error('Error create assignment:', error);
      throw new Error('Failed to create assignment');
    }
  }

  async findByStudentAndAssignment(studentId: string, assignmentId: string): Promise<IAssignment | null> {
    try {
      return await Assignment.findOne({ studentId, assignmentId }).exec();
    } catch (error) {
      console.error('Error find assignment:', error);
      throw new Error('Failed to find assignment');
    }
  }

  async updateAssignment(assignmentId: string, link: string): Promise<IAssignment | null> {
    try {
      const updatedAssignment = await Assignment.findOneAndUpdate({ assignmentId }, { link }, { new: true, runValidators: true }).exec();
      if (!updatedAssignment) {
        throw new Error('Assignment not found');
      }
      return updatedAssignment;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw new Error('Failed to update assignment submission');
    }
    // return await Assignment.findByIdAndUpdate(assignmentId, { link }, { new: true, runValidators: true }).exec();
  }

  async findByStudentAndCourse(studentId: string, courseId: string): Promise<IAssignment[]> {
    try {
      return await Assignment.find({ studentId, courseId }).exec();
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw new Error('Failed to update assignment submission');
    }
  }

  async createQuiz(submissionData: IQuizSubmission): Promise<IQuizSubmission> {
    try {
      const submission = new Quiz(submissionData);
      return await submission.save();
    } catch (error) {
      console.error('Error crete quiz:', error);
      throw new Error('Failed to create quiz');
    }
  }

  async findByStudentAndQuiz(studentId: string, quizId: string): Promise<IQuizSubmission | null> {
    try {
      return await Quiz.findOne({ studentId, quizId }).exec();
    } catch (error) {
      console.error('Error find quiz:', error);
      throw new Error('Failed to find quiz');
    }
  }

  async findCoupon() {
    try {
      return await Coupon.find();
    } catch (error) {
      console.error('Error find coupon and offer', error);
      throw new Error('Faile to find coupon and offer');
    }
  }

  async find() {
    try {
      return await User.find();
    } catch (error) {
      console.log('Error find users', error);
      throw new Error('Error find users');
    }
  }

  async findAnnouncements() {
    try {
      return await Announcement.find();
    } catch (error) {
      console.log('Error find users', error);
      throw new Error('Error find users');
    }
  }

  async createAnnouncement(announcementData: IAnnountment) {
    try {
      const submission = new Announcement(announcementData);
      return await submission.save();
    } catch (error) {
      console.log('Error create announcement', error);
      throw new Error('Error create announcement');
    }
  }
}
