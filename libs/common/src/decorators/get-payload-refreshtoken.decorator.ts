import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const GetPayloadRefreshToken = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies.refreshToken;
    const payload = jwt.decode(refreshToken);
    return payload;
  },
);
