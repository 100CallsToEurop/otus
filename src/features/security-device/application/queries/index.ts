import { Type } from '@nestjs/common';
import { IQueryHandler } from '@nestjs/cqrs';
import { GetAllUserDevicesQueryHandler } from './get-all-user-devices';

export const DEVICES_QUERY_HANDLERS: Type<IQueryHandler>[] = [
  GetAllUserDevicesQueryHandler,
];
