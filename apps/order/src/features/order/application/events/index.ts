import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { PaymentOrderEventHandler } from './payment-order';

export const ORDER_EVENT_HANDLERS: Type<IEventHandler>[] = [
  PaymentOrderEventHandler,
];
