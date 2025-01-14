import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateKeyCommandHandler } from './create-key';

export const IDEMPOTENT_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateKeyCommandHandler,
];
