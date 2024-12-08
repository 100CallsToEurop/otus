import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SecurityDeviceEntity } from '../../../domain';
import { SecurityDevicesRepository } from '../../../infrastructure/repository';
import { LoginUserEvent } from '../../../../auth/domain/events';

@EventsHandler(LoginUserEvent)
export class UpdateDeviceEventHandler implements IEventHandler<LoginUserEvent> {
  private readonly logger = new Logger(UpdateDeviceEventHandler.name);
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async handle(event: LoginUserEvent): Promise<void> {
    const { userId, deviceId } = event;
    this.logger.log(
      `Обновляем информацию о сессии пользователя userId: ${userId}`,
    );
    let currentSession;
    currentSession = await this.securityDevicesRepository.getCurrentDevice(
      userId,
      deviceId,
    );
    if (currentSession) {
      currentSession.update(event);
    } else {
      currentSession = SecurityDeviceEntity.create(event);
    }
    currentSession.plainToInstance();
    this.logger.log(`Сохраняем сессию пользователя userId: ${userId}`);
    await this.securityDevicesRepository.save(currentSession);
  }
}
