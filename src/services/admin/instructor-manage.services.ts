import { IInstructorMangeService } from '../../interfaces/IAdmin';
import { AdminRepo } from '../../repo/admin/admin.repo';

export class InstructorMangeService implements IInstructorMangeService{
  private _adminRepository: AdminRepo;

  constructor(adminRepository: AdminRepo) {
    this._adminRepository = adminRepository;
  }

  // get all instructor details
  async allinstructorDetails() {
    const allUser = await this._adminRepository.findInstructor();
    return allUser;
  }

  async changeStatus(instructorId: string, status: boolean){
    const changed = await this._adminRepository.updateById(instructorId, {isActive: status})
    return changed
  }
}
