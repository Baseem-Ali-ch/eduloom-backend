import express from 'express';
import { SharedController } from '../controllers/shared/shared.controller';
import { SharedService } from '../services/shared/shared.services';
import { BaseRepository } from '../repo/base.repo';
import { User } from '../models/User';
import { IUser } from '../interfaces/IUser';
import { InstructorRepo } from '../repo/instructor/instructor.repo';

export const sharedRouter = express.Router();

// repository dependencies
const baseRepository = new BaseRepository<IUser>(User);
const instructorRepository = new InstructorRepo();

// Service dependencies
const sharedService = new SharedService(baseRepository, instructorRepository);

// register controller
const sharedController = new SharedController(sharedService);

// authenticaiton routes
sharedRouter.post('/refresh-token', (req, res) => sharedController.handleRefreshToken(req, res));

// revenue routes
sharedRouter.get('/revenue', (req, res) => sharedController.getRevenues(req, res));
sharedRouter.get('/enrollment/:enrollmentId', (req, res) => sharedController.getCourseByEnrollmentId(req, res));
sharedRouter.post('/instructor/withdraw-all', (req, res) => sharedController.withdrawAll(req, res));
sharedRouter.post('/admin/withdraw-all', (req, res) => sharedController.withdrawAll(req, res));

