import { RequestWithUser } from '@app/types/requestWithUser.interface';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    if (request.user) {
      return true;
    }

    throw new UnauthorizedException('No Authorized');
  }
}
