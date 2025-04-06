import express from 'express';
import { UserRepo } from '../repo/student/student.repo';
import { OTPService } from '../services/student/otp.services';
import { EmailService } from '../services/student/email.services';
import { AuthService } from '../services/student/auth.services';
import { AuthController } from '../controllers/student/auth.controller';
import { ProfileController } from '../controllers/student/profile.controller';
import { ProfileService } from '../services/student/profile.services';
import { verifyToken } from '../middlewares/auth.middleware';
import { InstructorRepo } from '../repo/student/instructor.repo';
import { NotificationController } from '../controllers/student/notification.controller';
import { NotificationRepo } from '../repo/student/notification.repo';
import { NotificationService } from '../services/student/notification.services';
import upload from '../configs/multer';
import { instructorCourseController } from '../controllers/instructor/course.controller';
import { instructorCourseService } from '../services/instructor/course.services';
import { CourseRepo } from '../repo/instructor/course.repo';

export const userRouter = express.Router();

// Repository dependencies
const userRepo = new UserRepo();
const instructorRepo = new InstructorRepo();
const notificationRepo = new NotificationRepo();
const courseRepo = new CourseRepo();

// Service dependencies
const otpService = new OTPService();
const emailService = new EmailService();
const authService = new AuthService(userRepo, otpService, emailService);
const profileService = new ProfileService(userRepo, instructorRepo);
const notificationService = new NotificationService(notificationRepo, emailService);
const courseService = new instructorCourseService(courseRepo);

// register controller
const authController = new AuthController(authService);

// profle controller
const profileController = new ProfileController(profileService);

// notification controller
const notificationController = new NotificationController(notificationService);

// course controller 
const courseController = new instructorCourseController(courseService);

// authenticaiton routes
userRouter.post('/register', (req, res) => authController.register(req, res));
userRouter.post('/verify-otp', (req, res) => authController.verifyOtp(req, res));
userRouter.post('/resend-otp', (req, res) => authController.resendotp(req, res));
userRouter.post('/login', (req, res) => authController.login(req, res));
userRouter.post('/forget-password', (req, res) => authController.forgetPassword(req, res));
userRouter.post('/reset-password', (req, res) => authController.resetPassword(req, res));
userRouter.post('/google-auth', (req, res) => authController.googleAuth(req, res));
userRouter.post('/logout', (req, res) => authController.logout(req,res))

// profile routes
userRouter.get('/getUser', verifyToken, (req, res) => profileController.userDetails(req, res));
userRouter.get('/getImage', verifyToken, (req, res) => profileController.userImage(req, res));
userRouter.put('/profileUpdate', verifyToken, (req, res) => profileController.updateUser(req, res));
// userRouter.post('/profile-photo', verifyToken, (req, res) => profileController.uploadProfile(req, res)
userRouter.post('/profile-photo', verifyToken, upload.single('profilePhoto'), (req, res) => profileController.uploadProfile(req, res));
userRouter.post('/change-password', verifyToken, (req, res) => profileController.changePassword(req, res));
userRouter.post('/instructor-request', verifyToken, (req, res) => profileController.instructorRequest(req, res));

// notification handling routes
userRouter.get('/notification', (req, res) => notificationController.getNotification(req, res));
userRouter.put('/notification/:id', (req, res) => notificationController.updateStatus(req, res));
userRouter.post('/send-email', (req, res) => notificationController.sendNotificationMail(req, res));

// course handling routes
userRouter.post('/submit-assignment', verifyToken, (req, res) => courseController.submitAssignment(req, res));
userRouter.get('/submissions/:courseId', verifyToken, (req, res) => courseController.getStudentSubmissions(req, res));
userRouter.post('/submit-quiz', verifyToken, (req, res) => courseController.submitQuiz(req, res));
userRouter.post('/enroll', verifyToken, (req, res) => courseController.createOrder(req, res));
userRouter.post('/verify-payment', verifyToken, (req, res) => courseController.verifyPayment(req, res));
userRouter.get('/enrollment/:courseId', verifyToken, (req, res) => courseController.checkEnrollment(req, res));
userRouter.get('/coupons', verifyToken, (req, res) => courseController.getCoupons(req, res));