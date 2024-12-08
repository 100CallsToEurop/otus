import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

import { DeviceDto, LoginDto, RegistrationInputModel } from './models/input';
import {
  LoginSuccessViewModel,
  ResponseRegistrationViewModel,
} from './models/views';
import {
  GetCurrentUserDevice,
  GetCurrentUserId,
  Public,
} from '@app/common/decorators';
import { JwtAuthGuard, JwtAuthRefreshGuard } from '@app/common/guards';
import { AuthFacade } from '../application';

@Public()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly authFacade: AuthFacade,
  ) {}

  private async buildResponseNewTokens(
    res: Response,
    device: DeviceDto,
  ): Promise<LoginSuccessViewModel> {
    const tokens = await this.authFacade.commands.login(device);
    res.cookie('refreshToken', tokens.refreshToken, {
      maxAge: +this.configService.get<string>('RT_TIME') * 1000,
      httpOnly: true,
      //sameSite: 'none',
      //secure: process.env.NODE_ENV === 'production' ? true : false,
    });
    this.logger.log(`Успешно! userId = ${device.userId},`, `general`);
    return {
      accessToken: tokens.accessToken,
    };
  }

  @HttpCode(201)
  @Post('registration')
  async registrationUser(
    @Body() registrationDto: RegistrationInputModel,
  ): Promise<ResponseRegistrationViewModel> {
    return await this.authFacade.commands.registration(registrationDto);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('validate')
  async validate(@Req() request: Request): Promise<boolean> {
    const accessToken = request.headers.authorization.split(' ')[1];
    return await this.authFacade.commands.validate(accessToken);
  }

  @HttpCode(200)
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserDevice() { ip, user_agent }: DeviceDto,
    @Body() loginDto: LoginDto,
  ): Promise<LoginSuccessViewModel> {
    const userId = await this.authFacade.commands.checkCredentials(loginDto);
    const device: DeviceDto = {
      userId,
      ip,
      user_agent,
    };
    return await this.buildResponseNewTokens(res, device);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokenUser(
    @GetCurrentUserId() userId: string,
    @GetCurrentUserDevice()
    device: DeviceDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginSuccessViewModel> {
    return await this.buildResponseNewTokens(res, device);
  }

  @UseGuards(JwtAuthRefreshGuard)
  @HttpCode(204)
  @Post('logout')
  async logoutUser(
    @Res({ passthrough: true }) res: Response,
    @GetCurrentUserDevice()
    { userId, deviceId }: DeviceDto,
  ) {
    await this.authFacade.commands.logout(userId, deviceId);
    res.clearCookie('refreshToken');
  }
}
