import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { AddFundsCommandHandler } from './add-funds';
import { DeductFundsCommandHandler } from './deduct-funds';

export const BILLING_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  AddFundsCommandHandler,
  DeductFundsCommandHandler,
];
