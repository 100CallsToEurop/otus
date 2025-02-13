import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';

export const ORDER_USER_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
];
