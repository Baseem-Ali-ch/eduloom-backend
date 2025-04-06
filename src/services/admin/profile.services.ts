import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ObjectId } from 'mongoose';
import { IProfileService } from 'src/interfaces/IAdmin';
import { AdminRepo } from 'src/repo/admin/admin.repo';

export class ProfileService implements IProfileService{
  private _adminRepository: AdminRepo;
  private _s3Client: S3Client;

  constructor(adminRepository: AdminRepo) {
    this._adminRepository = adminRepository;
    this._s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // get all user details
  async adminDetails(adminId: string) {
    const user = await this._adminRepository.findById(adminId);
    return user;
  }

  async userImage(userId: ObjectId) {
      const user = await this._adminRepository.findById(userId);
      if (!user || !user.profilePhoto) {
        throw new Error('User or profile photo not found');
      }
  
      const signedUrl = await getSignedUrl(
        this._s3Client,
        new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME!,
          Key: user.profilePhoto,
        }),
        { expiresIn: 3600 }
      );
  
      return signedUrl;
    }

  // update user details
  async updateAdminDetails(adminId: string, userName: string, phone: string) {
    const user = await this._adminRepository.findById(adminId);
    if (!user) {
      throw new Error('User not found');
    }

    user.userName = userName;
    user.phone = phone;

    const updatedUser = await this._adminRepository.updateUser(user);
    return updatedUser;
  }

  // change password
  async changePassword(adminId: string, oldPassword: string, newPassword: string) {
    const user = await this._adminRepository.findById(adminId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this._adminRepository.passwordCompare(oldPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    const changedPassword = await this._adminRepository.updatePassword(user, newPassword);
    return changedPassword;
  }

  // update profile photo
    async uploadFileToS3(file: Express.Multer.File, userId: any) {
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: `profile-photos/${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
  
      try {
        await this._s3Client.send(new PutObjectCommand(params));
        const photoUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
  
        const user = await this._adminRepository.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        user.profilePhoto = photoUrl;
        console.log('user after upload', user);
        await this._adminRepository.updateUser(user);
        return photoUrl;
      } catch (error) {
        console.log('Error uploading file to s3', error);
        throw new Error('File upload failed');
      }
    }
}
