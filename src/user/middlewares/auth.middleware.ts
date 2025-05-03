import { RequestWithUser } from '@app/types/requestWithUser.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

import { config } from 'dotenv';
config();
@Injectable()
export class AuthMiddleWare implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  public async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      req.user = null;
      next();
      return;
    }

    try {
      const decode = verify(token, process.env.JWT_SECRET);

      const user = await this.userService.findById(decode.id);

      req.user = user;
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
