// src/controllers/student/registration.controller.ts
import { Request, Response } from 'express';
import logger from '../../configs/logger';
import { SharedService } from '../../services/shared/shared.services';

export class SharedController {
  private _sharedService: SharedService;

  constructor(sharedService: SharedService) {
    this._sharedService = sharedService;
  }

  // refresh token
  async handleRefreshToken(req: Request, res: Response) {
    try {
      console.log('hello there handle refresh');
      const refreshToken = req.body.refreshToken; // Ensure this matches the key sent from the client
      if (!refreshToken) {
        throw new Error('Token expired');
      }
      console.log('refresh in handle refresh', refreshToken);
      const newAccessToken = await this._sharedService.refreshAccessToken(refreshToken); // Ensure this is awaited
      console.log('new token', newAccessToken);
      res.status(200).json({
        token: newAccessToken,
        message: 'Access token refreshed successfully',
      });
    } catch (error) {
      logger.error('Controller: refreshing tokens', error);
      console.log('failed to refresh token', error);
      res.status(500).json({ message: error.message });
    }
  }

  async getRevenues(req: Request, res: Response) {
    try {
      console.log('body', req.body);
      const result = await this._sharedService.getRevnues();
      console.log('get revenues', result);
      res.status(200).json({ message: 'revenues get successfully', result });
    } catch (error) {
      logger.error('Error fetching revenue', error);
      res.status(500).json({ message: 'Error fetching revenue', error: error.message });
    }
  }

  async getCourseByEnrollmentId(req: Request, res: Response) {
    try {
      const enrollmentId = req.params.enrollmentId;
      const result = await this._sharedService.getCourse(enrollmentId);
      console.log('result', result?.enrolledStudents);
      res.status(200).json(result);
    } catch (error) {
      logger.error('Error fetching course', error);
      res.status(500).json({ message: 'Error fetching course', error });
    }
  }

  async withdrawAll(req: Request, res: Response) {
    try {
      const { instructorId } = req.body;
      const isInstructorRoute = req.path.includes('/instructor/withdraw-all');
      const isAdminRoute = req.path.includes('/admin/withdraw-all');
      let result
      if (isInstructorRoute) {
        console.log('ins router')

        result = await this._sharedService.withdraw(instructorId);
        console.log('Instructor withdrawal processed', result);
        res.status(200).json({ message: 'Withdrawal processed successfully for instructor', result });
      } else if (isAdminRoute) {
        result = await this._sharedService.adminWithdraw(instructorId); 
        console.log('Admin withdrawal processed', result);
        res.status(200).json({ message: 'Withdrawal processed successfully for admin', result });
      } else {
        // Handle unauthorized access
        res.status(403).json({ message: 'Unauthorized access' });
      }
    } catch (error) {
      logger.error('Error processing withdrawal', error);
      res.status(500).json({ message: 'Error processing withdrawal', error: error.message });
    }
  }

  
}
