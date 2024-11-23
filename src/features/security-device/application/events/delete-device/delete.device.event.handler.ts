import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SecurityDevicesRepository } from '../../../infrastructure/repository';
import { LogoutUserEvent } from '../../../../auth/domain/events';

@EventsHandler(LogoutUserEvent)
export class DeleteDeviceEventHandler
  implements IEventHandler<LogoutUserEvent>
{
  private readonly logger = new Logger(DeleteDeviceEventHandler.name);
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}
  async handle({ userId, deviceId }: LogoutUserEvent): Promise<void> {
    this.logger.log(`Удаление сессии пользователя...`);
    await this.securityDevicesRepository.deleteByDeviceId(deviceId, userId);
  }
}
