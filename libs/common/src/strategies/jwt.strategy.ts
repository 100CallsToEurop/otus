import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SecurityDevicesRepository } from '../../../../apps/auth/src/features/security-device/infrastructure/repository';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKey: process.env.AT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(payload: any) {
    const lastSession = await this.securityDevicesRepository.getCurrentDevice(
      payload.userId,
      payload.deviceId,
    );
    if (!lastSession) {
      throw new UnauthorizedException('Unauthorized');
    }
    return payload;
  }
}
