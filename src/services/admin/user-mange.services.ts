import { IUserManageService } from 'src/interfaces/IAdmin';
import { AdminRepo } from '../../repo/admin/admin.repo';

export class UserMangeService implements IUserManageService{
  private _adminRepository: AdminRepo;

  constructor(adminRepository: AdminRepo) {
    this._adminRepository = adminRepository;
  }

  // get all user details
  async allUserDetails(limit: number, skip: number) {
    const allUsers = await this._adminRepository.findUser(limit, skip);
    const totalUsers = await this._adminRepository.findTotalUsers();
    return { allUsers, totalUsers };
  }

  async changeStatus(userId: string, status: boolean) {
    console.log('user id', userId, status);
    const changed = await this._adminRepository.updateById(userId, {isActive: status});
    return changed;
  }
}
