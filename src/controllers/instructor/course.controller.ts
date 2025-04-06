import { instructorCourseService } from '../../services/instructor/course.services';
import { Request, Response } from 'express';
import logger from '../../configs/logger';
import { AnnouncementDTO, AssignmentSubmissionDTO, CourseDTO } from '../../dtos/dto';
import { MapAnnouncement, MapAssignmentSubmission, MapCourse } from '../../mappers/mapper';

export class instructorCourseController {
  private _instructorCourseService: instructorCourseService;

  constructor(instructorCourseService: instructorCourseService) {
    this._instructorCourseService = instructorCourseService;
  }

  // get course details
  async getCourse(req: Request, res: Response) {
    try {
      console.log('body', req.body);
      const result = await this._instructorCourseService.getCourse();
      res.json({ message: 'Course find', result });
    } catch (error) {
      console.log('Failed to get course', error);
      logger.error('Error during get course', error);
      res.status(500).json({ message: 'Error during get course' });
    }
  }

  // get course lessons documents
  async getDoc(req: Request, res: Response): Promise<any> {
    try {
      const courseId = req.query.courseId as string;
      if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required' });
      }
      console.log('Fetching signed URLs for course:', courseId);
      const result = await this._instructorCourseService.getDoc(courseId);
      console.log('result', result);
      res.json({ message: 'Signed URLs retrieved', result });
    } catch (error) {
      console.log('Failed to get signed URLs:', error);
      logger.error('Error during getDoc:', error);
      res.status(500).json({ message: 'Error fetching signed URLs', error: error.message });
    }
  }

  async createCourse(req: any, res: Response): Promise<void> {
    try {
      const files = req.files as Express.Multer.File[];

      const courseDataString = req.body.courseData;
      if (!courseDataString) {
        throw new Error('No course data provided');
      }
      const parsedCourseData = JSON.parse(courseDataString);

      const instructorId = req.userId;
      const dto = new CourseDTO(parsedCourseData);
      const courseData = MapCourse(dto, instructorId);

      const result = await this._instructorCourseService.createCourse(courseData, instructorId, files);
      res.status(200).json({ message: 'Course created successfully', result });
    } catch (error) {
      console.log('Failed to create course:', error);
      logger.error('Error during course creation:', error);
      res.status(500).json({ message: 'Error during course creation', error: error.message });
    }
  }

  async updateCourse(req: any, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const files = req.files as Express.Multer.File[];
      const courseData = JSON.parse(req.body.courseData);

      console.log('Updating course:', courseId);
      console.log('Course data:', courseData);
      console.log('Files:', files);

      const instructorId = req.userId;
      const dto = new CourseDTO(courseData);
      const updatedCourse = MapCourse(dto, instructorId);

      const result = await this._instructorCourseService.updateCourse(courseId, updatedCourse, files);
      res.status(200).json({ message: 'Course updated successfully', result });
    } catch (error) {
      console.log('Failed to update course:', error);
      logger.error('Error to update course:', error);
      res.status(500).json({ message: 'Error updating course', error: error.message });
    }
  }

  async publishCourse(req: any, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const result = await this._instructorCourseService.publishCourse(courseId);
      res.status(200).json({ message: 'Course published successfully', result });
    } catch (error) {
      console.log('Failed to publish course:', error);
      logger.error('Error during course publishing:', error);
      res.status(500).json({ message: 'Error during course publishing', error: error.message });
    }
  }

  // submit assignments
  async submitAssignment(req: any, res: Response): Promise<void> {
    try {
      const dto = new AssignmentSubmissionDTO(req.body);
      const { courseId, assignmentId, link } = MapAssignmentSubmission(dto);
      const studentId = req.userId;

      if (!courseId || !assignmentId || !link) {
        res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await this._instructorCourseService.submitAssignment(courseId, assignmentId, studentId, link);
      res.status(200).json({
        // message: result.submittedAt === result.updatedAt ? 'Assignment submitted successfully' : 'Assignment updated successfully',
        result,
      });
    } catch (error) {
      console.error('Error submitting assignment:', error);
      logger.error('Error to submitting assignment:', error);
      res.status(500).json({ message: 'Error submitting assignment', error: error.message });
    }
  }

  // submit quizzes
  async submitQuiz(req: any, res: Response): Promise<void> {
    try {
      const { courseId, quizId, answers } = req.body;
      const studentId = req.userId;

      if (!courseId || !quizId || !answers) {
        res.status(400).json({ message: 'Missing required fields' });
      }

      const result = await this._instructorCourseService.submitQuiz(courseId, quizId, studentId, answers);
      res.status(200).json({ message: 'Quiz submitted successfully', result });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      logger.error('Error to submitting quiz:', error);
      res.status(500).json({ message: 'Error submitting quiz', error: error.message });
    }
  }

  // payment handling
  async createOrder(req: any, res: Response): Promise<void> {
    try {
      const { courseId, amount } = req.body;
      const studentId = req.userId;
      const order = await this._instructorCourseService.createOrder(courseId, amount, studentId);
      console.log('order', order)
      res.status(200).json(order);
    } catch (error) {
      console.error('Error creating order:', error);
      logger.error('Error to creating order:', error);
      res.status(500).json({ message: 'Error creating order', error: error.message });
    }
  }

  // get assignment submissions
  async getStudentSubmissions(req: any, res: Response): Promise<void> {
    try {
      const courseId = req.params.courseId;
      const studentId = req.userId;
      const submissions = await this._instructorCourseService.getStudentSubmissions(studentId, courseId);
      res.status(200).json({ message: 'Submissions retrieved successfully', result: submissions });
    } catch (error) {
      console.error('Error fetching submissions:', error);
      logger.error('Error fetching submissions:', error);
      res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
  }

  // payment verification
  async verifyPayment(req: any, res: Response): Promise<void> {
    try {
      const paymentData = req.body;
      const studentId = req.userId;
      const result = await this._instructorCourseService.verifyPayment(paymentData, studentId);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
  }

  // ensure students enrollment
  async checkEnrollment(req: any, res: Response): Promise<void> {
    try {
      const { courseId } = req.params;
      console.log('id in parma', courseId);
      const studentId = req.userId;
      console.log('coursid ', courseId);
      const result = await this._instructorCourseService.checkEnrollment(courseId, studentId);
      console.log('result is enrolled', result);
      res.status(200).json(result);
    } catch (error) {
      console.error('Error checking enrollment:', error);
      res.status(500).json({ message: 'Error checking enrollment', error: error.message });
    }
  }

  // get coupons
  async getCoupons(req: Request, res: Response) {
    try {
      console.log(req.body);
      const result = await this._instructorCourseService.getCoupons();
      console.log('result coupn and offer', result);
      res.status(200).json({ message: 'Coupon and offers retrieved', result });
    } catch (error) {
      console.error('Error fething coupons and offer', error);
      logger.error('Error fething coupons and offer:', error);
      res.status(500).json({ message: 'Error fetching coupons and offer', error: error.message });
    }
  }

  async getStudents(req: Request, res: Response) {
    try {
      console.log(req.body);
      const result = await this._instructorCourseService.getStudents();
      res.status(200).json({ message: 'students all retrieved', result });
    } catch (error) {
      console.error('Error fething students', error);
      logger.error('Error fething students:', error);
      res.status(500).json({ message: 'Error fetching students', error: error.message });
    }
  }

  async createAnnouncement(req: Request, res: Response) {
    try {
      const dto = new AnnouncementDTO(req.body);
      const announcementData = MapAnnouncement(dto);
      const result = await this._instructorCourseService.addAnnouncement(announcementData);
      res.status(200).json({ message: 'announcement created successfully', result });
    } catch (error) {
      console.error('Error creating announcement', error);
      logger.error('Error creating announcement:', error);
      res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
  }

  async getAnnouncement(req: Request, res: Response){
    try {
      console.log('body', req.params)
      const result = await this._instructorCourseService.getAnnouncement();
      console.log('result', result)
      res.status(200).json({ message: 'announcements all retrieved', result });
    } catch (error) {
      console.error('Error creating announcement', error);
      logger.error('Error creating announcement:', error);
      res.status(500).json({ message: 'Error creating announcement', error: error.message });
    }
  }
}
