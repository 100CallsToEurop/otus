import { IEventHandler } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';
import { UpdateDeviceEventHandler } from './update-device';
import { DeleteDeviceEventHandler } from './delete-device';

export const DEVICE_EVENT_HANDLERS: Type<IEventHandler>[] = [
  UpdateDeviceEventHandler,
  DeleteDeviceEventHandler,
];
