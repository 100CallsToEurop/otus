import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
} from '@nestjs/common';
import { DeviceViewModel } from './models/views';
import { SecurityDevicesFacade } from '../application';
import { GetPayloadRefreshToken } from '@app/common/decorators';

@Controller('account/security/devices')
export class SecurityDevicesController {
  private readonly logger = new Logger(SecurityDevicesController.name);
  constructor(private readonly securityDevicesFacade: SecurityDevicesFacade) {}

  @Get()
  async getAllSecurityDevicesUser(
    @GetPayloadRefreshToken() payload,
  ): Promise<DeviceViewModel[]> {
    const { userId } = payload;
    const userDevices =
      await this.securityDevicesFacade.queries.getAllUserDevices(userId);
    return userDevices;
  }

  @HttpCode(204)
  @Delete(':deviceId')
  async deleteSecurityDeviceUser(
    @Param('deviceId') deleteDeviceId: string,
    @GetPayloadRefreshToken() payload: any,
  ): Promise<void> {
    const { userId, deviceId } = payload;
    await this.securityDevicesFacade.commands.deleteUserDevice(
      userId,
      deviceId,
      deleteDeviceId,
    );
  }

  @HttpCode(204)
  @Delete()
  async deleteAllSecurityDevicesUser(
    @GetPayloadRefreshToken() payload: any,
  ): Promise<void> {
    const { userId, deviceId } = payload;
    await this.securityDevicesFacade.commands.deleteAllUserDevices(
      userId,
      deviceId,
    );
  }
}
