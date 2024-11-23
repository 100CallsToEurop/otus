import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserDeviceCommandHandler } from './delete-user-device';
import { DeleteAllUserDevicesCommandHandler } from './delete-all-devices';

export const DEVICES_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  DeleteUserDeviceCommandHandler,
  DeleteAllUserDevicesCommandHandler,
];
