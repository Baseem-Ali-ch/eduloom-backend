import { Offer } from '../../models/Offer';
import { Coupon } from '../../models/Coupon';
import { BaseRepository } from '../base.repo';
import { ICoupon, IOffer } from 'src/interfaces/ICourse';

export class CourseRepo extends BaseRepository<any> {
  constructor() {
    super(Offer);
  }

  async findAllCoupon(): Promise<any> {
    try {
      return await Coupon.find();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Could not fetch users');
    }
  }

  async createCoupon(couponData: ICoupon) {
    try {
      const coupon = new Coupon(couponData);
      return coupon.save();
    } catch (error) {
      console.error('Error create', error);
      throw new Error('Error create');
    }
  }

  async updateByIdCoupon(id: string, updateData: Partial<ICoupon>) {
    const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
    return coupon;
  }

  async updateOffer(offerId: string, updatedOfferData: IOffer) {
    try {
      const offer = await Offer.findByIdAndUpdate(offerId, updatedOfferData, { new: true });
      return offer;
    } catch (error) {
      console.error('Error update offer', error);
      throw new Error('Error update offer');
    }
  }

  async updateCoupon(couponId: string, updatedCouponData: ICoupon) {
    try {
      const coupon = await Coupon.findByIdAndUpdate(couponId, updatedCouponData, { new: true });
      return coupon;
    } catch (error) {
      console.error('Error update coupon', error);
      throw new Error('Error update coupon');
    }
  }
}
