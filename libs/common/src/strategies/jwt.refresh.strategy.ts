import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BadTokenEntity } from '../../../../src/features/auth/domain';
import { BadTokenRepository } from '../../../../src/features/auth/infrastructure/repository';
import { SecurityDevicesRepository } from '../../../../src/features/security-device/infrastructure/repository';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'refresh') {
  private readonly logger = new Logger(RtStrategy.name);
  constructor(
    private readonly badTokensRepository: BadTokenRepository,
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {
    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: process.env.RT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request.cookies.refreshToken;
          if (!refreshToken) {
            throw new UnauthorizedException('Unauthorized');
          }
          return refreshToken;
        },
      ]),
      //jwtFromRequest: ExtractJwt.fromHeader('Cookie'),
    });
  }

  async validate(req: Request, payload: any) {
    this.logger.log('Проверка токена на валидность...');
    const refreshToken = req.cookies.refreshToken;
    this.logger.log('Проверяем токен в базе плохих токенов...');
    const checkBadToken =
      await this.badTokensRepository.findByRefreshToken(refreshToken);
    if (checkBadToken) {
      this.logger.warn(`Следует проверить пользователя!`);
      this.logger.error(`Устаревший токен пользователя...`);
      throw new UnauthorizedException('Unauthorized');
    }
    this.logger.log('Проверяем сессию...');
    const currentDeviceId = payload['deviceId'];
    const currentUserId = payload['userId'];
    const checkDeviceId = await this.securityDevicesRepository.getCurrentDevice(
      currentUserId,
      currentDeviceId,
    );
    if (!checkDeviceId) {
      const badToken = BadTokenEntity.create({ token: refreshToken });
      await this.badTokensRepository.save(badToken);
      this.logger.warn(`Следует проверить пользователя!`);
      this.logger.error(`Не найдена сессия пользователя...`);
      throw new UnauthorizedException('Unauthorized');
    }
    const badToken = BadTokenEntity.create({ token: refreshToken });
    this.logger.log('Все ок, сохранение токена в базе плохих токенов...');
    await this.badTokensRepository.save(badToken);
    return payload;
  }
}
