import { ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommandHandler } from './create-messages';
import { Type } from '@nestjs/common';

export const MESSAGE_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateMessageCommandHandler,
];
