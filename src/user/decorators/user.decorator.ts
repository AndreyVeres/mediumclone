import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from '../user.entity';
import { RequestWithUser } from '@app/types/requestWithUser.interface';

export const User = createParamDecorator((data: keyof UserEntity, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<RequestWithUser>();

  if (!request.user) {
    return null;
  }

  if (data) {
    return request.user[data];
  }

  return request.user;
});
