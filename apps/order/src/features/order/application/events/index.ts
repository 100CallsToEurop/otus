import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { CreateViewOrderEventHandler } from './create-view-order';
import { UpdateViewOrderEventHandler } from './update-view-order-status';

export const ORDER_EVENT_HANDLERS: Type<IEventHandler>[] = [
  CreateViewOrderEventHandler,
  UpdateViewOrderEventHandler,
];
