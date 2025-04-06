import { adminCourseService } from 'src/services/admin/course.services';
import { Response, Request } from 'express';
import { CouponDTO, OfferDTO } from '../../dtos/dto';
import { MapCoupon, MapOffer } from '../../mappers/mapper';
import logger from '../../configs/logger';
import { ICoupon, IOffer } from 'src/interfaces/ICourse';
import { validate } from 'class-validator';
// import logger from '../../configs/logger';
// import { CourseDTO } from '../../dtos/dto';
// import { MapCourse } from '../../mappers/mapper';

export class AdminCourseController {
  private _adminCourseService: adminCourseService;

  constructor(adminCourseService: adminCourseService) {
    this._adminCourseService = adminCourseService;
  }

  async getOffer(req: Request, res: Response) {
    try {
      console.log('body', req.body);
      const result = await this._adminCourseService.getOffers();
      res.status(200).json({ result });
    } catch (error) {
      console.log('failed to get offers', error);
      logger.error('Controller : Error get offers', error);
      res.status(500).json({ message: 'Error get offers' });
    }
  }

  async addOffer(req: Request, res: Response) {
    try {
      const dto = new OfferDTO(req.body.offerData);
      Object.assign(dto, req.body.offerData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      if (dto.discount > 100) {
        res.status(400).json({
          message: 'Validation failed',
          errors: [{ property: 'discount', message: 'Discount cannot exceed 100%' }],
        });
      }

      const offerData = MapOffer(dto);
      const result = await this._adminCourseService.addOffer(offerData);

      res.status(201).json({
        message: 'Offer Created Successfully',
        result,
      });
    } catch (error) {
      console.log('failed to create offer', error);
      logger.error('Controller : Error creating offer', error);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  async changeStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      const updatedOffer = await this._adminCourseService.changeStatus(id, status);
      res.status(200).json({ offer: updatedOffer, message: 'Offer status changed' });
    } catch (error) {
      console.log('Error updating offer status', error);
      logger.error('Controller : Error updating offer status', error);
      res.status(500).json({ message: 'Error updating offer status', error });
    }
  }

  async updateOffer(req: Request, res: Response) {
    try {
      const offerId = req.params.id;
      const updatedOfferData: IOffer = req.body;
      console.log('updatedOfferData', updatedOfferData);

      const updatedOffer = await this._adminCourseService.updateOffer(offerId, updatedOfferData);
      console.log('updatedOffer', updatedOffer);
      res.status(200).json({ message: 'Offer updated successfully', result: updatedOffer });
    } catch (error) {
      console.error('Error updating offer:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getCoupon(req: Request, res: Response) {
    try {
      console.log('body', req.body);
      const result = await this._adminCourseService.getCoupons();
      res.status(200).json({ result });
    } catch (error) {
      console.log('failed to get coupons', error);
      logger.error('Controller : Error get coupons', error);
      res.status(500).json({ message: 'Error get coupons' });
    }
  }

  async addCoupon(req: Request, res: Response) {
    try {
      console.log('req', req.body.couponData);

      const dto = new CouponDTO(req.body.couponData);
      Object.assign(dto, req.body.couponData);

      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          message: 'Validation failed',
          errors: errors.map((error) => ({
            property: error.property,
            constraints: error.constraints,
          })),
        });
      }

      const currentDate = new Date();
      const expiryDate = new Date(dto.expDate);
      if (expiryDate <= currentDate) {
        res.status(400).json({
          message: 'Validation failed',
          errors: [{ property: 'expDate', message: 'Expiry date must be in the future' }],
        });
      }

      if (dto.maxPurAmt && dto.minPurAmt > dto.maxPurAmt) {
        res.status(400).json({
          message: 'Validation failed',
          errors: [{ property: 'minPurAmt', message: 'Minimum purchase amount cannot exceed maximum purchase amount' }],
        });
      }

      const couponData = MapCoupon(dto);
      const result = await this._adminCourseService.addCoupon(couponData);

      res.status(201).json({
        message: 'Coupon Created Successfully',
        result,
      });
    } catch (error) {
      console.log('failed to create coupon', error);
      logger.error('Controller : Error creating coupon', error);
      res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
      });
    }
  }

  async couponChangeStatus(req: Request, res: Response) {
    try {
      const { id, status } = req.body;
      const updatedCoupon = await this._adminCourseService.couponChangeStatus(id, status);
      res.status(200).json({ coupon: updatedCoupon, message: 'Coupon status changed' });
    } catch (error) {
      console.log('Error updating coupon status', error);
      logger.error('Controller : Error updating coupon status', error);
      res.status(500).json({ message: 'Error updating coupon status', error });
    }
  }

  async updateCoupon(req: Request, res: Response) {
    try {
      const couponId = req.params.id;
      const updatedCouponData: ICoupon = req.body;

      const updatedCoupon = await this._adminCourseService.updateCoupon(couponId, updatedCouponData);
      res.status(200).json({ message: 'Offer updated successfully', result: updatedCoupon });
    } catch (error) {
      console.error('Error updating Coupon:', error);
      res.status(500).json({ message: 'Internal server Coupon' });
    }
  }
}
