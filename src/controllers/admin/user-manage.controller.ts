import { Request, Response } from 'express';
import { UserMangeService } from '../../services/admin/user-mange.services';
import logger from '../../configs/logger';

export class UserMangementController {
  private _userManageService: UserMangeService;
  constructor(userManageService: UserMangeService) {
    this._userManageService = userManageService;
  }

  // get all user details
  async allUserDetails(req: Request, res: Response) {
    try {

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;
      const { allUsers, totalUsers } = await this._userManageService.allUserDetails(limit, skip);

      res.status(200).json({
        users: allUsers,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error('Failed to get user details', error);
      logger.error('Controller : Error retrieving user details', error);
      res.status(500).json({ message: 'Error retrieving user details' });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      const updatedUser = await this._userManageService.changeStatus(id, status);
      console.log('updated user', updatedUser);
      res.status(200).json({ user: updatedUser, message: 'User status changed' });
    } catch (error) {
      console.log('Error updating user status', error);
      logger.error('Controller : Error updating user status', error);
      res.status(500).json({ message: 'Error updating user status', error });
    }
  }
}
