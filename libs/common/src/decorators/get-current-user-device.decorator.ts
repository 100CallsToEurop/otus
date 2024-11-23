import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserDevice = createParamDecorator(
  (data: undefined, context: ExecutionContext): any => {
    const request = context.switchToHttp().getRequest();

    let token = request.cookies.refreshToken;
    token ? token : (token = null);

    return {
      refreshToken: token,
      ip: request.ip,
      user_agent: request.headers['user-agent'],
      deviceId: request.user?.deviceId,
      userId: request.user?.userId,
    };
  },
);
