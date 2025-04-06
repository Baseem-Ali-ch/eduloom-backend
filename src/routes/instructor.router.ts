import express from 'express';
import { InstructorAuthController } from '../controllers/instructor/auth.controller';
import { InstructorRepo } from '../repo/instructor/instructor.repo';
import { InstructorAuthService } from '../services/instructor/auth.services';
import { EmailService } from '../services/student/email.services';
import { verifyToken } from '../middlewares/auth.middleware';
import { InstructorProfileController } from '../controllers/instructor/profile.controller';
import { InstructorProfileService } from '../services/instructor/profile.services';
import upload from '../configs/multer';
import { instructorCourseController } from '../controllers/instructor/course.controller';
import { instructorCourseService } from '../services/instructor/course.services';
import { CourseRepo } from '../repo/instructor/course.repo';

export const instructorRouter = express.Router();

// Repository dependencies
const instructorRepo = new InstructorRepo();
const courseRepo = new CourseRepo();

// Service dependencies
const emailService = new EmailService();
const instructorAuthService = new InstructorAuthService(instructorRepo, emailService);
const profileService = new InstructorProfileService(instructorRepo);
// const notificationService = new NotificationService(notificationRepo, emailService);
const courseService = new instructorCourseService(courseRepo);

// register controller
const authController = new InstructorAuthController(instructorAuthService);

// profle controller
const profileController = new InstructorProfileController(profileService);

// notification controller
// const notificationController = new NotificationController(notificationService);

// course controller
const courseController = new instructorCourseController(courseService);

// authenticaiton routes
instructorRouter.post('/register', (req, res) => authController.register(req, res));
instructorRouter.post('/login', (req, res) => authController.login(req, res));
instructorRouter.post('/forget-password', (req, res) => authController.forgetPassword(req, res));
instructorRouter.post('/reset-password', (req, res) => authController.resetPassword(req, res));
instructorRouter.post('/logout', (req, res) => authController.logout(req, res));

// profile routes
instructorRouter.get('/getInstructor', verifyToken, (req, res) => profileController.instructorDetails(req, res));
instructorRouter.get('/getImage', verifyToken, (req, res) => profileController.userImage(req, res));
instructorRouter.put('/profileUpdate', verifyToken, (req, res) => profileController.updateInstructor(req, res));
instructorRouter.post('/profile-photo', verifyToken, upload.single('profilePhoto'), (req, res) => profileController.uploadProfile(req, res));
instructorRouter.post('/change-password', verifyToken, (req, res) => profileController.changePassword(req, res));

// course routes
instructorRouter.post('/create-course', verifyToken, upload.array('documents', 10), (req, res) => courseController.createCourse(req, res));
instructorRouter.get('/get-courses', verifyToken, (req, res) => courseController.getCourse(req, res));
instructorRouter.get('/get-doc', verifyToken, (req, res) => courseController.getDoc(req, res));
instructorRouter.put('/update-course/:courseId', verifyToken, upload.array('documents', 10), (req, res) => courseController.updateCourse(req, res));
instructorRouter.post('/publish-course/:courseId', verifyToken, (req, res) => courseController.publishCourse(req, res));

instructorRouter.get('/get-students', verifyToken, (req, res) => courseController.getStudents(req, res));

// announcement routes
instructorRouter.post('/announcements', verifyToken, (req, res) => courseController.createAnnouncement(req, res));
instructorRouter.get('/announcements', verifyToken, (req, res) => courseController.getAnnouncement(req, res));


