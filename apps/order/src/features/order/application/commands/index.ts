import { ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommandHandler } from './create-order';
import { Type } from '@nestjs/common';
import { PaymentConfirmationCommandHandler } from './payment-confirmation';
import { PayOrderCommandHandler } from './pay-order';

export const ORDER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateOrderCommandHandler,
  PaymentConfirmationCommandHandler,
  PayOrderCommandHandler,
];
