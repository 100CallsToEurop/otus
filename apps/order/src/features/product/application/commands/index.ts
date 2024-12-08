import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommandHandler } from './create-product';

export const PRODUCT_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateProductCommandHandler,
];
