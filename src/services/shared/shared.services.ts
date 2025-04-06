import jwt from 'jsonwebtoken';
import { BaseRepository } from '../../repo/base.repo';
import { IUser } from 'src/interfaces/IUser';
import { InstructorRepo } from 'src/repo/instructor/instructor.repo';

export class SharedService {
  private _baseRepository: BaseRepository<IUser>;
  private _insructorRepository: InstructorRepo

  constructor(baseRepository: BaseRepository<IUser>, insructorRepository: InstructorRepo) {
    this._baseRepository = baseRepository;
    this._insructorRepository = insructorRepository
  }

  async refreshAccessToken(refreshToken: string): Promise<string> {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || '') as { id: string; email: string };

    const user = await this._baseRepository.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }

    const newAccessToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1h' });

    return newAccessToken;
  }

  async getRevnues(): Promise<any>{
    const revenues = await this._insructorRepository.findRevenues()
    return revenues
  }

  async getCourse(enrollmentId: string){
    const course = await this._insructorRepository.findCourse(enrollmentId)
    return course
  }

  async withdraw(instructorId: string){
    return await this._insructorRepository.updateMany(instructorId)
  }

  async adminWithdraw(instructorId: string){
    console.log('ins adm wi', instructorId)
    return await this._insructorRepository.updateManyAdm(instructorId)
  }
}
