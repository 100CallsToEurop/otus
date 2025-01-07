import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommandHandler } from './create-product';
import { ReserveProductCommandHandler } from './reserve-product';
import { CancelReserveProductCommandHandler } from './cancel-reserve';

export const PRODUCT_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateProductCommandHandler,
  CancelReserveProductCommandHandler,
  ReserveProductCommandHandler,
];
