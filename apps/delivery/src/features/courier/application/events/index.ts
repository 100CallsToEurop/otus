import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { ReservedEventHandler } from './reserved';

export const COURIER_EVENT_HANDLERS: Type<IEventHandler>[] = [
  ReservedEventHandler,
];
