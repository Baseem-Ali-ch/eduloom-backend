import { CourseRepo } from '../../repo/instructor/course.repo';
import { AnnouncementDTO, CourseDTO } from '../../dtos/dto';
import { ObjectId } from 'mongoose';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Course } from '../../models/Course';
import { EnrollesStudents, ICourse } from '../../interfaces/IInstructor';
import { MapCourse } from '../../mappers/mapper';
import { IAssignment, IQuizSubmission } from 'src/interfaces/ICourse';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Revenue } from '../../models/Revenue';


export class instructorCourseService {
  private _courseRepository: CourseRepo;
  private _s3Client: S3Client;
  private _razorpay: Razorpay;

  constructor(courseRepo: CourseRepo) {
    this._courseRepository = courseRepo;
    this._s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this._razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  async getCourse() {
    const courses = await this._courseRepository.findAllCourse();
    const populatedCourses = await Course.populate(courses, [{ path: 'instructorId' }, { path: 'offer' }]);
    return populatedCourses;
  }

  async getDoc(courseId: string): Promise<{ [key: string]: string }> {
    const course = await this._courseRepository.findById(courseId);

    if (!course) {
      throw new Error('Course not found');
    }

    const signedUrls: { [key: string]: string } = {};

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (lesson.document) {
          const signedUrl = await getSignedUrl(
            this._s3Client,
            new GetObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET_NAME!,
              Key: lesson.document,
            }),
            { expiresIn: 3600 }
          );
          signedUrls[lesson.document] = signedUrl;
        }
      }
    }

    return signedUrls;
  }

  async createCourse(courseData: CourseDTO, instructorId: ObjectId, files: Express.Multer.File[]): Promise<any> {
    courseData.instructorId = instructorId;

    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map(async (file: Express.Multer.File, index: number) => {
          const fileName = file.originalname;
          const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
          const key = `course-content/${Date.now()}-${index}-${sanitizedFileName}`;
          console.log('s3 key', key);

          const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
          };

          console.log('params', params);
          await this._s3Client.send(new PutObjectCommand(params));

          const signedUrl = await getSignedUrl(
            this._s3Client,
            new GetObjectCommand({
              Bucket: params.Bucket,
              Key: params.Key,
            }),
            { expiresIn: 3600 }
          );
          console.log('signed url', signedUrl);

          return { key, signedUrl };
        });

        const uploadedFiles = await Promise.all(uploadPromises);

        let fileIndex = 0;
        courseData.modules.forEach((module) => {
          module.lessons.forEach((lesson) => {
            if (fileIndex < uploadedFiles.length) {
              lesson.document = uploadedFiles[fileIndex].key;
              fileIndex++;
            }
          });
        });
      } catch (error) {
        console.error('Error uploading files to S3:', error);
        throw new Error('File upload failed');
      }
    }

    const mappedCourseData: ICourse = MapCourse(courseData, instructorId);
    try {
      const course = await this._courseRepository.create(mappedCourseData);
      console.log('Course created:', course);
      return course;
    } catch (error) {
      console.error('Error saving course to DB:', error);
      throw new Error('Failed to save course');
    }
  }

  async updateCourse(courseId: string, courseData: ICourse, files: Express.Multer.File[]): Promise<any> {
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file: Express.Multer.File, index: number) => {
        const fileName = file.originalname || `default-lesson-file-${index}`;
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '-').replace(/-+/g, '-');
        const key = `course-content/${Date.now()}-${index}-${sanitizedFileName}`;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        };

        await this._s3Client.send(new PutObjectCommand(params));
        return { key };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      let fileIndex = 0;
      courseData.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          if (fileIndex < uploadedFiles.length && !lesson.document) {
            lesson.document = uploadedFiles[fileIndex].key;
            fileIndex++;
          }
        });
      });
    }

    const updatedCourse = await this._courseRepository.updateCourse(courseId, courseData);
    if (!updatedCourse) {
      throw new Error('Course not found or update failed');
    }
    return updatedCourse;
  }

  async publishCourse(courseId: string): Promise<any> {
    const updatedCourse = await this._courseRepository.updateCourse(courseId, { status: 'published' });
    if (!updatedCourse) {
      throw new Error('Course not found or publish failed');
    }
    return updatedCourse;
  }

  async submitAssignment(courseId: string, assignmentId: string, studentId: string, link: string): Promise<IAssignment> {
    const course = await this._courseRepository.findById(courseId);
    if (!course || !course.assignments.some((a: any) => a._id.toString() === assignmentId)) {
      throw new Error('Course or assignment not found');
    }

    const existingSubmission = await this._courseRepository.findByStudentAndAssignment(studentId, assignmentId);
    if (existingSubmission) {
      const updatedSubmission = await this._courseRepository.updateAssignment(assignmentId, link);
      if (!updatedSubmission) {
        throw new Error('Failed to update assignment submission');
      }
      return updatedSubmission;
    }

    // Create new submission
    const submissionData: IAssignment = {
      courseId,
      assignmentId,
      studentId,
      link,
      submittedAt: new Date(),
    } as IAssignment;

    return await this._courseRepository.createAssignment(submissionData);
  }

  async submitQuiz(courseId: string, quizId: string, studentId: string, answers: { [questionId: string]: string }): Promise<IQuizSubmission> {
    const course = await this._courseRepository.findById(courseId);
    if (!course || !course.quizzes.some((q: any) => q._id.toString() === quizId)) {
      throw new Error('Course or quiz not found');
    }

    const submissionData: IQuizSubmission = {
      courseId,
      quizId,
      studentId,
      answers,
      submittedAt: new Date(),
    } as IQuizSubmission;

    return await this._courseRepository.createQuiz(submissionData);
  }

  async createOrder(courseId: string, amount: number, studentId: string): Promise<any> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throw new Error('Course not found');

    const isAlreadyEnrolled = course.enrolledStudents?.some((student: EnrollesStudents) => student.studentId === studentId);
    if (isAlreadyEnrolled) {
      throw new Error('Student is already enrolled in this course');
    }

    console.log(studentId);
    const options = {
      amount,
      currency: 'INR',
      receipt: `receipt_${courseId}`,
    };

    return await this._razorpay.orders.create(options);
  }

  async verifyPayment(paymentData: any, studentId: string): Promise<any> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = paymentData;
    const key_secret = process.env.RAZORPAY_KEY_SECRET as string;
    const generated_signature = crypto.createHmac('sha256', key_secret).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest('hex');

    if (generated_signature === razorpay_signature) {
      const course = await this._courseRepository.findById(courseId);
      if (!course) throw new Error('Course not found');

      if (!course.enrolledStudents) {
        course.enrolledStudents = [];
      }
      if (!course.enrolledStudents.some((student) => student.studentId === studentId)) {
        const newStudent: EnrollesStudents = { studentId };
        course.enrolledStudents.push(newStudent);

        await this._courseRepository.updateCourse(courseId, { enrolledStudents: course.enrolledStudents });
      }

      const instructorRevenueShare = course.price * 0.8;
      const adminRevenueShare = course.price * 0.2;
      const enrollmentId = (course.enrolledStudents ?? []).map((student) => student._id);
      console.log('studendid', enrollmentId);
      await Revenue.create([
        {
          enrollment: enrollmentId,
          instructor: course.instructorId,
          admin: process.env.DEFAULT_ADMIN_ID,
          instructorShare: instructorRevenueShare,
          adminShare: adminRevenueShare,
          date: new Date(),
        },
      ]);

      console.log('instructorRevenueShare', instructorRevenueShare, adminRevenueShare, enrollmentId);

      return {
        status: 'success',
        instructorRevenueShare,
        adminRevenueShare,
        enrollmentId: enrollmentId,
      };
    }
    return { status: 'failed' };
  }

  async checkEnrollment(courseId: string, studentId: string): Promise<{ isEnrolled: boolean }> {
    const course = await this._courseRepository.findById(courseId);
    if (!course) throw new Error('Course not found');

    const isEnrolled = course.enrolledStudents?.some((student) => student.studentId == studentId) ?? false;
    return { isEnrolled };
  }

  async getStudentSubmissions(studentId: string, courseId: string): Promise<IAssignment[]> {
    return await this._courseRepository.findByStudentAndCourse(studentId, courseId);
  }

  async getCoupons() {
    return await this._courseRepository.findCoupon();
  }

  async getStudents() {
    return await this._courseRepository.find();
  }

  async addAnnouncement(announcementData: AnnouncementDTO) {
    const coupons = await this._courseRepository.createAnnouncement(announcementData);
    return coupons;
  }

  async getAnnouncement() {
    return await this._courseRepository.findAnnouncements();
  }
}
