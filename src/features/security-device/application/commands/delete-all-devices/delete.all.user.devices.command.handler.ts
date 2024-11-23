import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteAllUserDevicesCommand } from './delete.all.user.devices.command';
import { SecurityDevicesRepository } from '../../../infrastructure/repository';

@CommandHandler(DeleteAllUserDevicesCommand)
export class DeleteAllUserDevicesCommandHandler
  implements ICommandHandler<DeleteAllUserDevicesCommand>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}
  async execute({
    userId,
    deviceId,
  }: DeleteAllUserDevicesCommand): Promise<void> {
    await this.securityDevicesRepository.deleteAllByUser(userId, deviceId);
  }
}
