import { ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommandHandler } from './create-order';
import { Type } from '@nestjs/common';
import { PlaceOrderCommandHandler } from './place-order';
import { UpdateViewOrderCommandHandler } from './update-view-order';

export const ORDER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateOrderCommandHandler,
  PlaceOrderCommandHandler,
  UpdateViewOrderCommandHandler,
];
