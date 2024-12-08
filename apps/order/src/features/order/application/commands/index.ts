import { ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommandHandler } from './create-order';
import { Type } from '@nestjs/common';
import { PaymentConfirmationCommandHandler } from './payment-confirmation';

export const ORDER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateOrderCommandHandler,
  PaymentConfirmationCommandHandler,
];
