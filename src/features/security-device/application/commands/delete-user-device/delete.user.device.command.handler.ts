import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserDeviceCommand } from './delete.user.device.command';
import { BadRequestException, Logger } from '@nestjs/common';
import { SecurityDevicesRepository } from '../../../infrastructure/repository';

@CommandHandler(DeleteUserDeviceCommand)
export class DeleteUserDeviceCommandHandler
  implements ICommandHandler<DeleteUserDeviceCommand>
{
  private readonly logger = new Logger(DeleteUserDeviceCommandHandler.name);
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}
  async execute({
    userId,
    deviceId,
    deleteDeviceId,
  }: DeleteUserDeviceCommand): Promise<void> {
    this.logger.log(
      `Удаление пользователем userId: ${userId} девайс deviceId: ${deleteDeviceId}`,
    );
    if (deviceId === deleteDeviceId) {
      const message = 'Нельзя удалить текущую сессию';
      this.logger.error(message);
      throw new BadRequestException(message);
    }
    await this.securityDevicesRepository.deleteByDeviceId(
      deleteDeviceId,
      userId,
    );
  }
}
