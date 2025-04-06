import { AdminAuthService } from 'src/services/admin/auth.services';
import { Request, Response } from 'express';
import logger from '../../configs/logger';
import { LoginDTO } from '../../dtos/dto';
import { MapLogin } from '../../mappers/mapper';

export class AdminAduthController {
  private _adminAuthService: AdminAuthService;
  constructor(adminAuthService: AdminAuthService) {
    this._adminAuthService = adminAuthService;
  }

  // login
  async login(req: Request, res: Response) {
    try {
      // const { email, password } = req.body;
      const dto = new LoginDTO(req.body);
      const { email, password } = MapLogin(dto);
      const result = await this._adminAuthService.login(email, password);
      res.status(201).json(result);
    } catch (error) {
      console.log('failed to login', error);
      logger.error('Controller : Error during admin login', error);
      res.status(500).json({ message: 'Error during login' });
    }
  }
}
