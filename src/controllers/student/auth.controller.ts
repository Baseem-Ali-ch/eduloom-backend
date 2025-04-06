// src/controllers/student/registration.controller.ts
import { Request, Response } from 'express';
import { AuthService } from '../../services/student/auth.services';
import logger from '../../configs/logger';
import { ForgetPasswordDTO, GoogleAuthDTO, LoginDTO, RegisterDTO, ResendOtpDTO, ResetPasswordDTO, VerifyOtpDTO } from '../../dtos/dto';
import { MapForgetPassword, MapGoogleAuth, MapLogin, MapRegister, MapResendOtp, MapResetPassword, MapVerifyOtp } from '../../mappers/mapper';
import redisClient from '../../configs/redis';
import jwt from 'jsonwebtoken';

export class AuthController {
  private _authService: AuthService;

  constructor(authService: AuthService) {
    this._authService = authService;
  }

  // registration
  async register(req: Request, res: Response) {
    try {
      // const { user } = req.body;
      const dto = new RegisterDTO(req.body.user);
      const userModel = MapRegister(dto);
      const result = await this._authService.register(userModel);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error during registration:', error);
      logger.error('Controller : Error during registration', error);
      res.status(500).json({ message: 'Error during registration' });
    }
  }

  // verify otp
  async verifyOtp(req: Request, res: Response) {
    try {
      // const { email, otp } = req.body;
      const dto = new VerifyOtpDTO(req.body);
      const { email, otp } = MapVerifyOtp(dto);
      const result = await this._authService.verifyOTP(email, otp);
      res.status(200).json(result);
    } catch (error) {
      console.log('Error verify otp', error);
      logger.error('Controller : Error during otp verification', error);
      res.status(500).json({ message: 'Error during otp verify' });
    }
  }

  // resend otp
  async resendotp(req: Request, res: Response) {
    try {
      // const { email } = req.body;
      const dto = new ResendOtpDTO(req.body);
      const { email } = MapResendOtp(dto);
      const result = await this._authService.resendOTP(email);
      res.status(200).json(result);
    } catch (error) {
      console.log('Failed to resend OTP:', error);
      logger.error('Controller : Error to send OTP', error);
      res.status(500).json({ message: 'Failed to send OTP' });
    }
  }

  // login
  async login(req: Request, res: Response) {
    try {
      // const { email, password } = req.body;
      const dto = new LoginDTO(req.body);
      const { email, password } = MapLogin(dto);
      const result = await this._authService.login(email, password);

      res.status(201).json(result);
    } catch (error) {
      console.log('failed to login', error);
      logger.error('Controller : Error during login', error);
      res.status(500).json({ message: error.message });
    }
  }

  // forget password
  async forgetPassword(req: Request, res: Response) {
    try {
      // const { email } = req.body;
      const dto = new ForgetPasswordDTO(req.body);
      const { email } = MapForgetPassword(dto);
      const result = await this._authService.forgetPassword(email);
      res.status(200).json(result);
    } catch (error) {
      console.log('failed forget password', error);
      logger.error('Controller : Error forget password', error);
      res.status(500).json({ message: 'failed to forget password handling' });
    }
  }

  // reset password
  async resetPassword(req: Request, res: Response) {
    try {
      // const { token, password } = req.body;
      const dto = new ResetPasswordDTO(req.body);
      const { token, password } = MapResetPassword(dto);

      const result = await this._authService.resetPassword(token, password);
      res.status(200).json(result);
    } catch (error) {
      console.log('failed reset password', error);
      logger.error('Controller : Error reset password', error);
      res.status(500).json({ message: 'failed to reset password handling' });
    }
  }

  // login with google
  async googleAuth(req: Request, res: Response) {
    try {
      // const { token } = req.body;
      const dto = new GoogleAuthDTO(req.body);
      const { token } = MapGoogleAuth(dto);
      const result = await this._authService.googleAuth(token);
      res.status(200).json(result);
    } catch (error) {
      console.error('Google authentication error:', error);
      logger.error('Controller : Error google authentication', error);
      res.status(500).json({ message: 'Authentication failed' });
    }
  }

  async logout(req: any, res: Response) {
    console.log('logout here')
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(400).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.decode(token) as { exp?: number };
      const expiresIn = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;

      await redisClient.setEx(token, expiresIn, 'blacklisted');
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      console.log('Logout failed', error);
      logger.error('Controller : Error during logout', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
}
