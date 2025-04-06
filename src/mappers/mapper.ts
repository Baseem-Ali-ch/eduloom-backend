import { ObjectId } from 'mongoose';
import {
  AnnouncementDTO,
  AssignmentSubmissionDTO,
  ChangePasswordDTO,
  CouponDTO,
  CourseDTO,
  ForgetPasswordDTO,
  GoogleAuthDTO,
  InstructoInfoDTO,
  LoginDTO,
  NotificationUpdateStatusDTO,
  OfferDTO,
  RegisterDTO,
  ResendOtpDTO,
  ResetPasswordDTO,
  SendNotificationMailDTO,
  UpdateUserDTO,
  UserDetailsImageDTO,
  VerifyOtpDTO,
} from '../dtos/dto';
import { IUser } from '../interfaces/IUser';

export function MapRegister(dto: RegisterDTO): IUser {
  return {
    email: dto.email,
    password: dto.password,
    userName: dto.userName,
  };
}

export function MapVerifyOtp(dto: VerifyOtpDTO) {
  return {
    email: dto.email,
    otp: dto.otp,
  };
}

export function MapResendOtp(dto: ResendOtpDTO) {
  return {
    email: dto.email,
  };
}

export function MapLogin(dto: LoginDTO) {
  return {
    email: dto.email,
    password: dto.password,
  };
}

export function MapForgetPassword(dto: ForgetPasswordDTO) {
  return {
    email: dto.email,
  };
}

export function MapResetPassword(dto: ResetPasswordDTO) {
  return {
    token: dto.token,
    password: dto.password,
  };
}

export function MapGoogleAuth(dto: GoogleAuthDTO) {
  return {
    token: dto.token,
  };
}

export function MapNotificationUpdateStatus(dto: NotificationUpdateStatusDTO) {
  return {
    status: dto.status,
  };
}

export function MapSendNotificationMail(dto: SendNotificationMailDTO) {
  return {
    userId: dto.userId,
    message: dto.message,
  };
}

export function MapUserDetailsImage(dto: UserDetailsImageDTO) {
  return {
    userId: dto.userId,
  };
}

export function MapUpdateUser(dto: UpdateUserDTO) {
  return {
    userName: dto.userName,
    phone: dto.phone,
  };
}

export function MapChangePassword(dto: ChangePasswordDTO) {
  return {
    currentPassword: dto.currentPassword,
    newPassword: dto.newPassword,
  };
}

export function MapInstructorRequest(dto: InstructoInfoDTO) {
  return {
    userName: dto.userName,
    phone: dto.phone,
    country: dto.country,
    state: dto.state,
    qualification: dto.qualification,
    workExperience: dto.workExperience,
    lastWorkingPlace: dto.lastWorkingPlace,
    specialization: dto.specialization,
  };
}

export function MapCourse(dto: CourseDTO, instructorId: ObjectId) {
  return {
    title: dto.title,
    description: dto.description,
    category: dto.category,
    difficultyLevel: dto.difficultyLevel,
    price: dto.price,
    modules: dto.modules.map((module) => ({
      title: module.title,
      lessons: module.lessons.map((lesson) => ({
        title: lesson.title,
        content: lesson.content,
        document: typeof lesson.document === 'string' ? lesson.document : undefined,
      })),
    })),
    assignments: dto.assignments.map((assignment) => ({
      assignmentTitle: assignment.assignmentTitle,
      assignmentDescription: assignment.assignmentDescription,
    })),
    quizzes: dto.quizzes.map((quiz) => ({
      title: quiz.title,
      questions: quiz.questions.map((question) => ({
        questionText: question.questionText,
        options: question.options.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      })),
    })),
    liveClasses: dto.liveClasses.map((liveClass) => ({
      title: liveClass.title,
      scheduleDate: liveClass.scheduleDate,
      duration: liveClass.duration,
      meetingLink: liveClass.meetingLink,
      description: liveClass.description,
    })),
    instructorId: instructorId,
    offer: dto.offer,
    coupon: dto.coupon,
    isActive: dto.isActive,
    status: dto.status
  };
}

export function MapOffer(dto: OfferDTO) {
  return {
    title: dto.title,
    category: dto.category,
    discount: dto.discount,
    status: dto.status,
  };
}

export function MapCoupon(dto: CouponDTO) {
  return {
    couponCode: dto.couponCode,
    description: dto.description,
    discount: dto.discount,
    expDate: dto.expDate,
    minPurAmt: dto.minPurAmt,
    maxPurAmt: dto.maxPurAmt,
    isActive: dto.isActive,
  };
}

export function MapAssignmentSubmission(dto: AssignmentSubmissionDTO){
  return {
    courseId: dto.courseId,
    assignmentId: dto.assignmentId,
    studentId: dto.studentId,
    link: dto.link
  }
}

export function MapAnnouncement(dto: AnnouncementDTO){
  return {
    instructorId: dto.instructorId,
    title: dto.title,
    description: dto.description
  }
}
