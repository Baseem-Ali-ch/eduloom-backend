import { AdminRepo } from 'src/repo/admin/admin.repo';
import jwt from 'jsonwebtoken';

export class AdminAuthService {
  private _adminRepository: AdminRepo;
  constructor(adminRepository: AdminRepo) {
    this._adminRepository = adminRepository;
  }

  // login
  async login(email: string, password: string) {
    const user = await this._adminRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await this._adminRepository.passwordCompare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    return {
      token,
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.userName,
      },
    };
  }
}
