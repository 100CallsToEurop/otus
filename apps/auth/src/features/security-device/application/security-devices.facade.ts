import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  GetAllUserDevicesQuery,
  GetAllUserDevicesQueryHandler,
} from './queries/get-all-user-devices';
import {
  DeleteUserDeviceCommand,
  DeleteUserDeviceCommandHandler,
} from './commands/delete-user-device';
import {
  DeleteAllUserDevicesCommand,
  DeleteAllUserDevicesCommandHandler,
} from './commands/delete-all-devices';

export class SecurityDevicesFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    deleteAllUserDevices: (userId: number, deviceId: string) =>
      this.deleteAllUserDevices(userId, deviceId),
    deleteUserDevice: (
      userId: number,
      deviceId: string,
      deleteDeviceId: string,
    ) => this.deleteUserDevice(userId, deviceId, deleteDeviceId),
  };

  events = {};

  queries = {
    getAllUserDevices: (userId: number) => this.getAllUserDevices(userId),
  };

  private deleteAllUserDevices(userId: number, deviceId: string) {
    return this.commandBus.execute<
      DeleteAllUserDevicesCommand,
      Awaited<ReturnType<DeleteAllUserDevicesCommandHandler['execute']>>
    >(new DeleteAllUserDevicesCommand(userId, deviceId));
  }

  private deleteUserDevice(
    userId: number,
    deviceId: string,
    deleteDeviceId: string,
  ) {
    return this.commandBus.execute<
      DeleteUserDeviceCommand,
      Awaited<ReturnType<DeleteUserDeviceCommandHandler['execute']>>
    >(new DeleteUserDeviceCommand(userId, deviceId, deleteDeviceId));
  }

  private getAllUserDevices(userId: number) {
    return this.queryBus.execute<
      GetAllUserDevicesQuery,
      Awaited<ReturnType<GetAllUserDevicesQueryHandler['execute']>>
    >(new GetAllUserDevicesQuery(userId));
  }
}
