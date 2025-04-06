import { Request, Response } from 'express';
import logger from '../../configs/logger';
import { InstructorMangeService } from 'src/services/admin/instructor-manage.services';

export class InstructorMangementController {
  private _instructorMangeService: InstructorMangeService;
  constructor(instructorMangeService: InstructorMangeService) {
    this._instructorMangeService = instructorMangeService;
  }

  // get all user details
  async allInstructorDetails(req: Request, res: Response) {
    try {
      console.log('body in admin controller', req.body);
      const instructors = await this._instructorMangeService.allinstructorDetails();
      res.status(200).json(instructors);
    } catch (error) {
      console.log('Failed to get admin details', error);
      logger.error('Controller : Error retrieving admin details', error);
      res.status(500).json({ message: 'Error retrieving admin details' });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      const updatedUser = await this._instructorMangeService.changeStatus(id, status);
      console.log('updated user', updatedUser);
      res.status(200).json({ user: updatedUser, message: 'User status changed' });
    } catch (error) {
      console.log('Error updating user status', error);
      logger.error('Controller : Error updating user status', error);
      res.status(500).json({ message: 'Error updating user status', error });
    }
  }
}
