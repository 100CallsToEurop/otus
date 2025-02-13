import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { OutboxStartEventProcessCommandHandler } from './outbox-start-event-process';

export const OUTBOX_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  OutboxStartEventProcessCommandHandler,
];
