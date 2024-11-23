import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createNewTokens(payload: any): Promise<{
    accessToken;
    refreshToken;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: +this.configService.get<string>('AT_TIME'),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: +this.configService.get<string>('RT_TIME'),
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const verificationResult = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('RT_SECRET'),
        ignoreExpiration: true,
      });
      return !!verificationResult;
    } catch {
      return false;
    }
  }

  async decodeToken(token: string) {
    try {
      return await this.jwtService.verify(token, {
        secret: this.configService.get<string>('RT_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('Неверный логин или пароль');
    }
  }
}
