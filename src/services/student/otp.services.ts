import crypto from "crypto";
import { IOTPService } from "../../interfaces/IUser";

export class OTPService implements IOTPService{
  generateOTP(length: number = 6): string {
    // Create a string of digits
    const digits = "0123456789";
    let otp = "";

    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, digits.length);
      otp += digits[randomIndex]; 
    }

    return otp; 
  }

  validateOTPExpiry(expiresAt: Date): boolean {
    return expiresAt > new Date();
  }
}
