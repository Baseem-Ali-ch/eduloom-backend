import { ObjectId } from 'mongoose';
import { IInstructor } from '../../interfaces/IInstructor';
import { IProfileService } from '../../interfaces/IUser';
import { InstructorRepo } from '../../repo/student/instructor.repo';
import { UserRepo } from '../../repo/student/student.repo';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class ProfileService implements IProfileService {
  private _userRepository: UserRepo;
  private _instructorRepository: InstructorRepo;
  private _s3Client: S3Client;

  constructor(userRepository: UserRepo, instructorRepository: InstructorRepo) {
    this._userRepository = userRepository;
    this._instructorRepository = instructorRepository;
    this._s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  // get all user details
  async userDetails(userId: ObjectId) {
    const user = await this._userRepository.findById(userId);
    return user;
  }

  async userImage(userId: ObjectId) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if(!user.profilePhoto){
      return null
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
  async updateUserDetails(userId: ObjectId, userName: string, phone: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.userName = userName;
    user.phone = phone;

    const updatedUser = await this._userRepository.update(user);
    return updatedUser;
  }

  // change password
  async changePassword(userId: ObjectId, currentPassword: string, newPassword: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await this._userRepository.passwordCompare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid current password');
    }

    const changedPassword = await this._userRepository.updatePassword(user, newPassword);
    return changedPassword;
  }

  // instructor request to admin
  async instructorReq(data: IInstructor, userId: ObjectId) {
    const { userName, phone, country, state, qualification, workExperience, lastWorkingPlace, specialization } = data;

    if (!userId) {
      throw new Error('User  ID is required');
    }
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error('User  not found');
    }

    const notificationData = {
      userId: userId,
      title: 'Instructor Application',
      message: `Your application to become an instructor is pending review.`,
      description:
        'We have received your application to become an instructor. Our team is currently reviewing your qualifications and experience. We aim to provide a response within 5-7 business days. Thank you for your patience.',
      status: 'pending',
    };
    await this._instructorRepository.createNotification(notificationData);

    const instructorData = {
      userName,
      email: user.email,
      phone,
      country,
      state,
      qualification,
      workExperience,
      lastWorkingPlace,
      specialization,
    };
    await this._instructorRepository.create(instructorData);
  }

  async uploadFileToS3(file: Express.Multer.File, userId: ObjectId) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: `profile-photos/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      await this._s3Client.send(new PutObjectCommand(params));

      const signedUrl = await getSignedUrl(
        this._s3Client,
        new GetObjectCommand({
          Bucket: params.Bucket,
          Key: params.Key,
        }),
        { expiresIn: 3600 }
      );

      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.profilePhoto = params.Key;
      await this._userRepository.update(user);
      return signedUrl;
    } catch (error) {
      console.log('Error uploading file to s3', error);
      throw new Error('File upload failed');
    }
  }
}
