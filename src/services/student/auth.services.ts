import { UserRepo } from '../../repo/student/student.repo';
import { OTPService } from './otp.services';
import { EmailService } from './email.services';
import { GoogleUser, IUser, OTPDetails } from '../../interfaces/IUser';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { verifyGoogleToken } from '../../middlewares/googleAuth.middleware';
import bcrypt from 'bcrypt';

export class AuthService {
  private _userRepository: UserRepo;
  private _otpService: OTPService;
  private _emailService: EmailService;
  private _userStore: Record<string, { userName: string; password: string; otp: OTPDetails }> = {};

  constructor(userRepository: UserRepo, otpService: OTPService, emailService: EmailService) {
    this._userRepository = userRepository;
    this._otpService = otpService;
    this._emailService = emailService;
  }

  // register service
  async register(userData: IUser) {
    const { email, password, userName } = userData;
    const existUser = await this._userRepository.findByEmail(email);
    if (existUser) {
      throw new Error('User already exists');
    }

    const otp = this._otpService.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    console.log('Your OTP is :', otp);
    // Store temporary user data
    this._userStore[email] = {
      userName,
      password,
      otp: { code: otp, expiresAt: otpExpiry },
    };

    await this._emailService.sendOTPEmail(email, otp);

    return { message: 'Registration successful. Check your email for OTP.' };
  }

  // verify otp service
  async verifyOTP(email: string, otp: string) {
    const storedUser = this._userStore[email];

    if (!storedUser) {
      throw new Error('User not found');
    }
    if (storedUser.otp.code !== otp || storedUser.otp.expiresAt < new Date()) {
      throw new Error('Invalid or expired OTP');
    }

    const salt = await bcrypt.genSalt(10);
    storedUser.password = await bcrypt.hash(storedUser.password, salt);
    console.log('stored user', storedUser);
    const newUser = await this._userRepository.create({
      userName: storedUser.userName,
      email,
      password: storedUser.password,
      isActive: true,
      isVerified: true,
    });
    delete this._userStore[email];

    if (!newUser) {
      throw new Error('User creation failed');
    }

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });
    const refreshToken = jwt.sign({ id: newUser._id, email: newUser.email }, process.env.JWT_REFRESH_SECRET || '', { expiresIn: '7d' });

    return {
      token,
      refreshToken,
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.userName,
      },
    };
  }

  // resent otp
  async resendOTP(email: string) {
    const storedUser = this._userStore[email];
    if (!storedUser) {
      throw new Error('User not found');
    }
    const otp = this._otpService.generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    console.log('Regenerated OTP', otp);
    storedUser.otp = { code: otp, expiresAt: otpExpiry };
    this._userStore[email] = storedUser;
    await this._emailService.sendOTPEmail(email, otp);
    return { message: 'OTP Resent Successfully. Check your email.' };
  }

  // login
  async login(email: string, password: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    console.log('user det', user)

    const result = await this._userRepository.findStatus(user);
    if (result?.isActive === false) {
      throw new Error('User is blocked');
    }

    const isPasswordValid = await this._userRepository.passwordCompare(password, user.password);
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

  // forget password
  async forgetPassword(email: string) {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '15m' });
    const resetLink = `https://eduloom.fun/student/reset-password/${resetToken}`;
    console.log('Password reset link', resetLink);
    await this._emailService.sendPasswordResetEmail(email, resetLink);
    return {
      message: 'Password Reset Link Sent Successfully. Check your email.',
    };
  }

  // reset password
  async resetPassword(token: string, password: string) {
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || '') as JwtPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
    const email = decoded.email as string;

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    await this._userRepository.updatePassword(user, password);
    return {
      message: 'Password Reset Successfully',
    };
  }

  // google authentication
  async googleAuth(token: string) {
    const googleUser = await verifyGoogleToken(token);
    if (!googleUser) {
      throw new Error('Invalid Google token');
    }

    let user: GoogleUser | null = await this._userRepository.findByEmail(googleUser.email as string);
    if (!user) {
      user = await this._userRepository.createGoogleUser({
        email: googleUser.email,
        userName: googleUser.name,
        googleId: googleUser.sub,
        profilePhoto: googleUser.picture,
        isVerified: true,
      });
    } else {
      user.googleId = googleUser.sub;
      user.profilePhoto = googleUser.picture;
      user.isVerified = true;
      await this._userRepository.updateGoogleUser(user);
    }

    if (!user) {
      throw new Error('User  creation failed');
    }
    const jwtToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '1d' });

    return {
      token: jwtToken,
      user: {
        _id: user._id,
        email: user.email,
        userName: user.userName,
        profilePhoto: user.profilePhoto,
      },
    };
  }
}
