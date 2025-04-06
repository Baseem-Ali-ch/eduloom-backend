import express from 'express';

import { AdminAduthController } from '../controllers/admin/auth.controller';
import { AdminRepo } from '../repo/admin/admin.repo';
import { AdminAuthService } from '../services/admin/auth.services';
import { verifyToken } from '../middlewares/auth.middleware';
import { ProfileController } from '../controllers/admin/profile.controller';
import { ProfileService } from '../services/admin/profile.services';
import { UserMangementController } from '../controllers/admin/user-manage.controller';
import { UserMangeService } from '../services/admin/user-mange.services';
import { InstructorMangementController } from '../controllers/admin/instructor-mange.controller';
import { InstructorMangeService } from '../services/admin/instructor-manage.services';
import upload from '../configs/multer';
import { AdminCourseController } from '../controllers/admin/course.controller';
import { adminCourseService } from '../services/admin/course.services';
import { CourseRepo } from '../repo/admin/course.repo';

export const adminRouter = express.Router();

// repository dependency
const adminRepository = new AdminRepo();
const courseRepository = new CourseRepo();

// service dependency
const adminAuthService = new AdminAuthService(adminRepository);
const profileService = new ProfileService(adminRepository);
const userManageService = new UserMangeService(adminRepository);
const instructorMangeService = new InstructorMangeService(adminRepository);
const adminCourseMangeService = new adminCourseService(courseRepository);

// authentication controller
const authController = new AdminAduthController(adminAuthService);

// profle controller
const profileController = new ProfileController(profileService);

// user mangement controller
const userMangementController = new UserMangementController(userManageService);

// user mangement controller
const instructorMangementController = new InstructorMangementController(instructorMangeService);

// course management controller
const courseMangementController = new AdminCourseController(adminCourseMangeService);

// auth routes
adminRouter.post('/login', (req, res) => authController.login(req, res));

// profile routes
adminRouter.get('/getUser', verifyToken, (req, res) => profileController.adminDetails(req, res));
adminRouter.get('/getImage', verifyToken, (req, res) => profileController.userImage(req, res));
adminRouter.put('/profileUpdate', verifyToken, (req, res) => profileController.updateAdmin(req, res));
adminRouter.post('/profile-photo', verifyToken, upload.single('profilePhoto'), (req, res) => profileController.uploadProfile(req, res));
adminRouter.post('/change-password', verifyToken, (req, res) => profileController.changePassword(req, res));

// user management routes
adminRouter.get('/getAllUser', (req, res) => userMangementController.allUserDetails(req, res));
adminRouter.patch('/changeStatus/status', (req, res) => userMangementController.changeStatus(req, res));

// instructor mangement routes
adminRouter.get('/getAllInstructor', (req, res) => instructorMangementController.allInstructorDetails(req, res));
adminRouter.patch('/changeStatusIns/status', (req, res) => instructorMangementController.changeStatus(req, res));

// offer management routes
adminRouter.get('/get-offers', (req, res) => courseMangementController.getOffer(req, res));
adminRouter.post('/add-offer', (req, res) => courseMangementController.addOffer(req, res));
adminRouter.patch('/change-offer/status', (req, res) => courseMangementController.changeStatus(req, res));
adminRouter.put('/update-offer/:id', (req, res) => courseMangementController.updateOffer(req, res));

// coupons management routes
adminRouter.get('/get-coupons', (req, res) => courseMangementController.getCoupon(req, res));
adminRouter.post('/add-coupon', (req, res) => courseMangementController.addCoupon(req, res));
adminRouter.patch('/change-coupon/status', (req, res) => courseMangementController.couponChangeStatus(req, res));
adminRouter.put('/update-coupon/:id', (req, res) => courseMangementController.updateCoupon(req, res));
