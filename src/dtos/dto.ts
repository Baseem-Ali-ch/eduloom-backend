import { ObjectId } from 'mongoose';

export class RegisterDTO {
  email: string;
  password: string;
  userName: string;

  constructor(data: Partial<RegisterDTO>) {
    this.email = data.email?.trim().toLowerCase() || '';
    this.password = data.password || '';
    this.userName = data.userName?.trim() || '';
  }
}

export class VerifyOtpDTO {
  email: string;
  otp: string;

  constructor(data: Partial<VerifyOtpDTO>) {
    this.email = data.email?.trim().toLowerCase() || '';
    this.otp = data.otp || '';
  }
}

export class ResendOtpDTO {
  email: string;

  constructor(data: Partial<ResendOtpDTO>) {
    this.email = data.email?.trim().toLowerCase() || '';
  }
}

export class LoginDTO {
  email: string;
  password: string;

  constructor(data: Partial<LoginDTO>) {
    this.email = data.email?.trim().toLowerCase() || '';
    this.password = data.password || '';
  }
}

export class ForgetPasswordDTO {
  email: string;

  constructor(data: Partial<ForgetPasswordDTO>) {
    this.email = data.email?.trim().toLowerCase() || '';
  }
}

export class ResetPasswordDTO {
  token: string;
  password: string;

  constructor(data: Partial<ResetPasswordDTO>) {
    this.token = data.token || '';
    this.password = data.password || '';
  }
}

export class GoogleAuthDTO {
  token: string;

  constructor(data: Partial<GoogleAuthDTO>) {
    this.token = data.token || '';
  }
}

export class NotificationUpdateStatusDTO {
  status: boolean;

  constructor(data: Partial<NotificationUpdateStatusDTO>) {
    this.status = data.status || false;
  }
}

export class SendNotificationMailDTO {
  userId: ObjectId | string;
  message: string;

  constructor(data: Partial<SendNotificationMailDTO>) {
    this.userId = data.userId || '';
    this.message = data.message || '';
  }
}

export class UserDetailsImageDTO {
  userId: ObjectId | string;

  constructor(data: Partial<UserDetailsImageDTO>) {
    this.userId = data.userId || '';
  }
}

export class UpdateUserDTO {
  userName: string;
  phone: string;

  constructor(data: Partial<UpdateUserDTO>) {
    this.userName = data.userName || '';
    this.phone = data.phone || '';
  }
}

export class ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;

  constructor(data: Partial<ChangePasswordDTO>) {
    this.currentPassword = data.currentPassword || '';
    this.newPassword = data.newPassword || '';
  }
}

export class InstructoInfoDTO {
  userName: string;
  phone: string;
  country: string;
  state: string;
  qualification: string;
  workExperience: string;
  lastWorkingPlace: string;
  specialization: string;

  constructor(data: Partial<InstructoInfoDTO>) {
    this.userName = data.userName || '';
    this.phone = data.phone || '';
    this.country = data.country || '';
    this.state = data.state || '';
    this.qualification = data.qualification || '';
    this.workExperience = data.qualification || '';
    this.lastWorkingPlace = data.lastWorkingPlace || '';
    this.specialization = data.specialization || '';
  }
}

export class LessonDTO {
  title: string;
  content: string;
  document?: Express.Multer.File | string;

  constructor(data: Partial<LessonDTO>) {
    this.title = data.title || '';
    this.content = data.content || '';
    this.document = data.document;
  }
}

export class ModuleDTO {
  title: string;
  lessons: LessonDTO[];

  constructor(data: Partial<ModuleDTO>) {
    this.title = data.title || '';
    this.lessons = data.lessons?.map((lesson) => new LessonDTO(lesson)) || [];
  }
}

export class AssignmentDTO {
  assignmentTitle: string;
  assignmentDescription: string;

  constructor(data: Partial<AssignmentDTO>) {
    this.assignmentTitle = data.assignmentTitle || '';
    this.assignmentDescription = data.assignmentDescription || '';
  }
}

export class QuizOptionDTO {
  optionText: string;
  isCorrect: boolean;

  constructor(data: Partial<QuizOptionDTO>) {
    this.optionText = data.optionText || '';
    this.isCorrect = data.isCorrect || false;
  }
}

export class QuizQuestionDTO {
  questionText: string;
  options: QuizOptionDTO[];

  constructor(data: Partial<QuizQuestionDTO>) {
    this.questionText = data.questionText || '';
    this.options = data.options?.map((option) => new QuizOptionDTO(option)) || [];
  }
}

export class QuizDTO {
  title: string;
  questions: QuizQuestionDTO[];

  constructor(data: Partial<QuizDTO>) {
    this.title = data.title || '';
    this.questions = data.questions?.map((question) => new QuizQuestionDTO(question)) || [];
  }
}

export class LiveClassDTO {
  title: string;
  scheduleDate: string;
  duration: string;
  meetingLink: string;
  description: string;

  constructor(data: Partial<LiveClassDTO>) {
    this.title = data.title || '';
    this.scheduleDate = data.scheduleDate || '';
    this.duration = data.duration || '';
    this.meetingLink = data.meetingLink || '';
    this.description = data.description || '';
  }
}

export class CourseDTO {
  title: string;
  description: string;
  category: string;
  difficultyLevel: string;
  price: number;
  modules: ModuleDTO[];
  assignments: AssignmentDTO[];
  quizzes: QuizDTO[];
  liveClasses: LiveClassDTO[];
  instructorId: ObjectId | null;
  offer: ObjectId | null;
  coupon: ObjectId | null;
  isActive: boolean;
  status: 'draft' | 'published';

  constructor(data: Partial<CourseDTO>) {
    this.title = data.title || '';
    this.description = data.description || '';
    this.category = data.category || '';
    this.difficultyLevel = data.difficultyLevel || '';
    this.price = data.price || 0;
    this.modules = data.modules?.map((module) => new ModuleDTO(module)) || [];
    this.assignments = data.assignments?.map((assignment) => new AssignmentDTO(assignment)) || [];
    this.quizzes = data.quizzes?.map((quiz) => new QuizDTO(quiz)) || [];
    this.liveClasses = data.liveClasses?.map((liveClass) => new LiveClassDTO(liveClass)) || [];
    this.instructorId = data.instructorId || null;
    this.offer = data.offer || null;
    this.coupon = data.coupon || null;
    this.isActive = data.isActive || true;
    this.status = data.status || 'draft';
  }
}

export class OfferDTO {
  title: string;
  category: string;
  discount: number;
  status: boolean;

  constructor(data: Partial<OfferDTO>) {
    this.title = data.title || '';
    this.category = data.category || '';
    this.discount = data.discount || 0;
    this.status = data.status || false;
  }
}

export class CouponDTO {
  couponCode: string;
  description: string;
  discount: number;
  expDate: string;
  minPurAmt: number;
  maxPurAmt: number;
  isActive: boolean;

  constructor(data: Partial<CouponDTO>) {
    this.couponCode = data.couponCode || '';
    this.description = data.description || '';
    this.discount = data.discount || 0;
    this.expDate = data.expDate || '';
    this.minPurAmt = data.minPurAmt || 0;
    this.maxPurAmt = data.maxPurAmt || 0;
    this.isActive = data.isActive || false;
  }
}

export class AssignmentSubmissionDTO {
  courseId: string;
  assignmentId: string;
  link: string;
  studentId: string;

  constructor(data: Partial<AssignmentSubmissionDTO>) {
    this.courseId = data.courseId || '';
    this.assignmentId = data.assignmentId || '';
    this.link = data.link || '';
    this.studentId = data.studentId || '';
  }
}

export class AnnouncementDTO {
  instructorId: string;
  title: string;
  description: string;

  constructor(data: Partial<AnnouncementDTO>){
    this.instructorId = data.instructorId || ''
    this.title = data.title || ''
    this.description = data.description || ''
  }
}
