import { Response } from 'express';
import { InstructorProfileService } from '../../services/instructor/profile.services';
import logger from '../../configs/logger';
import { ChangePasswordDTO, UpdateUserDTO } from '../../dtos/dto';
import { MapChangePassword, MapUpdateUser } from '../../mappers/mapper';

export class InstructorProfileController {
  private _instructorProfileService: InstructorProfileService;
  constructor(instructorProfileService: InstructorProfileService) {
    this._instructorProfileService = instructorProfileService;
  }

  // get user details
  async instructorDetails(req: any, res: Response) {
    try {
      const instructorId = req.userId;
      const instructor = await this._instructorProfileService.instructorDetails(instructorId);
      res.status(200).json({ instructor });
    } catch (error) {
      console.log('Failed to get instructor details', error);
      logger.error('Controller : Error retrieving user details', error);
      res.status(500).json({ message: 'Error retrieving user details' });
    }
  }

  async userImage(req: any, res: Response) {
    try {
      const instructorId = req.userId;
      const signedUrl = await this._instructorProfileService.userImage(instructorId);
      res.status(200).json({ signedUrl });
    } catch (error) {
      console.log('Failed to get user details', error);
      logger.error('Controller : Error retrieving user details', error);
      res.status(500).json({ message: 'Error retrieving user details' });
    }
  }

  // update user details
  async updateInstructor(req: any, res: Response) {
    try {
      // const updateData = req.body;
      const dto = new UpdateUserDTO(req.body);
      const updateData = MapUpdateUser(dto);
      const instructorId = req.userId;

      const updatedInstructor = await this._instructorProfileService.updateInstructor(instructorId, updateData);
      res.status(200).json({ message: 'Profile updated successfully', updatedInstructor });
    } catch (error) {
      console.error('Error updating user', error);
      logger.error('Controller : Error updating profle', error);
      res.status(500).json({ messgae: 'Error updating profile' });
    }
  }

  // chagne user password
  async changePassword(req: any, res: Response) {
    try {
      // const { currentPassword, newPassword } = req.body;
      const dto = new ChangePasswordDTO(req.body);
      const { currentPassword, newPassword } = MapChangePassword(dto);
      const userId = req.userId;
      await this._instructorProfileService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log('failed to change password', error);
      logger.error('Controller : Error to change password', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  }

  // profile photo update
  async uploadProfile(req: any, res: Response): Promise<void> {
    try {
      console.log('req', req.file);
      console.log('userid', req.userId);
      const userId = req.userId;
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
      }

      const fileUrl = await this._instructorProfileService.uploadFileToS3(req.file, userId);
      res.status(200).json({ message: 'Update successful', photoUrl: fileUrl });
    } catch (error) {
      console.log('Failed to update profile photo', error);
      logger.error('Controller : Error to update profile photo', error);
      res.status(500).json({ message: 'Failed to update profile photo' });
    }
  }
}
