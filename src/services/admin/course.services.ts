import { CouponDTO, OfferDTO } from 'src/dtos/dto';
import { CourseRepo } from '../../repo/admin/course.repo';
import { ICoupon, IOffer } from 'src/interfaces/ICourse';

export class adminCourseService {
  private _courseRepository: CourseRepo;

  constructor(courseRepo: CourseRepo) {
    this._courseRepository = courseRepo;
  }

  async getOffers() {
    const offers = await this._courseRepository.findAll();
    return offers;
  }

  async addOffer(offerData: OfferDTO) {
    const offer = await this._courseRepository.create(offerData);
    return offer;
  }

  async changeStatus(userId: string, status: boolean) {
    console.log('user id', userId, status);
    const changed = await this._courseRepository.updateById(userId, { isActive: status });
    return changed;
  }

  async updateOffer(offerId : string, updatedOfferData: IOffer){
    const changed = await this._courseRepository.updateOffer(offerId, updatedOfferData)
    return changed
  }

  async getCoupons() {
    const coupons = await this._courseRepository.findAllCoupon();
    return coupons;
  }

  async addCoupon(couponData: CouponDTO) {
    const coupons = await this._courseRepository.createCoupon(couponData);
    return coupons;
  }

  async couponChangeStatus(userId: string, status: boolean) {
    const changed = await this._courseRepository.updateByIdCoupon(userId, { isActive: status });
    return changed;
  }

  async updateCoupon(Coupon : string, updatedCouponData: ICoupon){
    const changed = await this._courseRepository.updateCoupon(Coupon, updatedCouponData)
    return changed
  }
}
