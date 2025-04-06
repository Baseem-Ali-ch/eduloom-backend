import { Response } from 'express';
import logger from '../../configs/logger';
import { ProfileService } from '../../services/admin/profile.services';
import { ChangePasswordDTO, UpdateUserDTO } from '../../dtos/dto';
import { MapChangePassword, MapUpdateUser } from '../../mappers/mapper';

export class ProfileController {
  private _profileService: ProfileService;
  constructor(profileService: ProfileService) {
    this._profileService = profileService;
  }

  // get admin details
  async adminDetails(req: any, res: Response) {
    try {
      const adminId = req.userId;
      const user = await this._profileService.adminDetails(adminId);
      res.status(200).json({ user });
    } catch (error) {
      console.log('Failed to get admin details', error);
      logger.error('Controller : Error retrieving admin details', error);
      res.status(500).json({ message: 'Error retrieving admin details' });
    }
  }

  async userImage(req: any, res: Response) {
    try {
      const instructorId = req.userId;
      const signedUrl = await this._profileService.userImage(instructorId);
      res.status(200).json({ signedUrl });
    } catch (error) {
      console.log('Failed to get user details', error);
      logger.error('Controller : Error retrieving user details', error);
      res.status(500).json({ message: 'Error retrieving user details' });
    }
  }

  // update user details
  async updateAdmin(req: any, res: Response) {
    try {
      // const { userName, phone } = req.body;
      const dto = new UpdateUserDTO(req.body);
      const { userName, phone } = MapUpdateUser(dto);
      const adminId = req.userId;
      const user = await this._profileService.updateAdminDetails(adminId, userName, phone);
      res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error('Error updating user', error);
      logger.error('Controller : Error updating profile', error);
      res.status(500).json({ messgae: 'Error updating profile' });
    }
  }

  // chagne user password
  async changePassword(req: any, res: Response) {
    try {
      // const { oldPassword, newPassword } = req.body;
      const dto = new ChangePasswordDTO(req.body);
      const { currentPassword, newPassword } = MapChangePassword(dto);
      const adminId = req.userId;
      await this._profileService.changePassword(adminId, currentPassword, newPassword);
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.log('failed to change password', error);
      logger.error('Controller : Failed to change password', error);
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

      const fileUrl = await this._profileService.uploadFileToS3(req.file, userId);
      res.status(200).json({ message: 'Update successful', photoUrl: fileUrl });
    } catch (error) {
      console.log('Failed to update profile photo', error);
      logger.error('Controller : Error to update profile photo', error);
      res.status(500).json({ message: 'Failed to update profile photo' });
    }
  }
}
