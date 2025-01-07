import { Type } from '@nestjs/common';
import { IEventHandler } from '@nestjs/cqrs';
import { SendResultOperationEventHandler } from './send-result-operation';
import { SendNotificationEventHandler } from './send-notification';

export const BILLING_EVENT_HANDLERS: Type<IEventHandler>[] = [
  SendResultOperationEventHandler,
  SendNotificationEventHandler,
];
