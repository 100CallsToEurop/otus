import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { ReservedEventHandler } from './reserved';

export const PRODUCT_EVENT_HANDLERS: Type<IEventHandler>[] = [
  ReservedEventHandler,
];
