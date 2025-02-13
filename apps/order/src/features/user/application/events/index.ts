import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { SendNotificationEventHandler } from './send-notification';

export const ORDER_USER_EVENT_HANDLERS: Type<IEventHandler>[] = [
  SendNotificationEventHandler,
];
