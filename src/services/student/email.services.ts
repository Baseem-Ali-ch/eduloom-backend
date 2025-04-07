import nodemailer from 'nodemailer';
import { IEmailService, IUser } from 'src/interfaces/IUser';

export class EmailService implements IEmailService {
  private _transporter;

  constructor() {
    this._transporter = nodemailer.createTransport({
      service: 'gmail',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // Use SSL for 465, TLS for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send mail for OTP verification with timeout
  async sendOTPEmail(email: string, otp: string): Promise<void> {
    try {
      const mailPromise = this._transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔐 OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="text-align: center; color: #4CAF50;">🔒 OTP Verification</h2>
            <p>Hello,</p>
            <p>Your One-Time Password (OTP) for verification is:</p>
            <p style="font-size: 24px; font-weight: bold; text-align: center; color: #d9534f; background: #f8d7da; padding: 10px; border-radius: 5px;">
              ${otp}
            </p>
            <p>This OTP is valid for <strong>1 minute</strong>. Please do not share it with anyone.</p>
            <p>If you did not request this verification, please ignore this email.</p>
            <p>Best regards,<br><strong>Your Security Team</strong></p>
          </div>
        `,
      });

      // Race email send against a 10-second timeout
      await Promise.race([
        mailPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Email send timed out after 10s')), 10000)
        ),
      ]);
      console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
      console.error(`Failed to send OTP email to ${email}:`, error);
      throw error; // Propagate to caller for handling
    }
  }

  // Send mail for password reset (unchanged for now, can apply similar timeout if needed)
  async sendPasswordResetEmail(email: string, resetLink: string) {
    await this._transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Your Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 2px 2px 10px rgba(0,0,0,0.1);">
          <h2 style="text-align: center; color: #333;">Password Reset Request</h2>
          <p style="color: #555; font-size: 16px;">Hello,</p>
          <p style="color: #555; font-size: 16px;">
            You recently requested to reset your password. Click the button below to reset it. This link is valid for <strong>15 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 20px 0;">
            <a href="${resetLink}" 
              style="background-color: #007bff; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #555; font-size: 14px;">
            If you did not request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
          <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
          <p style="text-align: center; color: #888; font-size: 12px;">
            © 2025 Your Company. All rights reserved.
          </p>
        </div>
      `,
    });
  }

  // Send mail for instructor request (unchanged for now)
  async sendNotificationEmail(user: IUser, message: string) {
    await this._transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: '🎉 Congratulations! Your Instructor Request is Accepted',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
          <h2 style="color: #4CAF50;">🎉 Congratulations, ${user.userName}!</h2>
          <p>${message}</p>
          <p>We are excited to inform you that your request to become an instructor has been <strong style="color: green;">accepted</strong>!</p>
          <p>You can now complete your registration by clicking the link below:</p>
          <p style="text-align: center;">
            <a href="https://eduloom.fun/instructor/register" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
               Complete Registration
            </a>
          </p>
          <p>If the above button doesn't work, please copy and paste the following link into your browser:</p>
          <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px;">
            <a href="https://eduloom.fun/instructor/register" style="color: #4CAF50;">https://eduloom.fun/instructor/register</a>
          </p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br><strong>The Team</strong></p>
        </div>
      `,
    });
  }
}