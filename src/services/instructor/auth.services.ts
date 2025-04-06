import jwt, { JwtPayload } from 'jsonwebtoken';
import { InstructorRepo } from '../../repo/instructor/instructor.repo';
import bcrypt from 'bcrypt';
import { EmailService } from '../student/email.services';

export class InstructorAuthService {
  private _instructorRepository: InstructorRepo;
  private _emailService: EmailService;

  constructor(instructorRepository: InstructorRepo, emailService: EmailService) {
    this._instructorRepository = instructorRepository;
    this._emailService = emailService;
  }

  // register service
  async register(email: string, password: string) {
    const instructor = await this._instructorRepository.findByEmail(email);
    if (!instructor) {
      throw new Error('Instructor not found, Please enter registered email');
    }

    if (instructor.password) {
      throw new Error('Instructor already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    instructor.password = hashedPassword;
    instructor.isActive = true;
    instructor.isVerified = true;
    await this._instructorRepository.update(instructor);

    const token = jwt.sign({ id: instructor._id, email: instructor.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: instructor._id, email: instructor.email }, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    return {
      message: 'Registration successful.',
      token,
      refreshToken,
      instructor: {
        id: instructor._id,
        email: instructor.email,
        userName: instructor.userName,
      },
    };
  }

  // login
  async login(email: string, password: string) {
    const instructor = await this._instructorRepository.findByEmail(email);
    if (!instructor) {
      throw new Error('Invalid credentials');
    }
    const result = await this._instructorRepository.findStatus(instructor);
    if (result?.isActive === false) {
      throw new Error('Instructor is blocked');
    }

    const isPasswordValid = await this._instructorRepository.passwordCompare(password, instructor.password as string);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: instructor._id, email: instructor.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: instructor._id, email: instructor.email }, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    return {
      token,
      refreshToken,
      user: {
        id: instructor._id,
        email: instructor.email,
        username: instructor.userName,
      },
    };
  }

  // // forget password
  async forgetPassword(email: string) {
    const instructor = await this._instructorRepository.findByEmail(email);
    if (!instructor) {
      throw new Error('Instructor not found');
    }

    const resetToken = jwt.sign({ email: instructor.email }, process.env.JWT_SECRET || '', { expiresIn: '15m' });
    const resetLink = `https://eduloom.fun/instructor/reset-password/${resetToken}`;
    console.log('Password reset link', resetLink);
    await this._emailService.sendPasswordResetEmail(email, resetLink);
    return {
      message: 'Password Reset Link Sent Successfully. Check your email.',
    };
  }

  // // reset password
  async resetPassword(token: string, password: string) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
    const email = decoded.email as string;

    const user = await this._instructorRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    await this._instructorRepository.updatePassword(user, password);
    return {
      message: 'Password Reset Successfully',
    };
  }
}
