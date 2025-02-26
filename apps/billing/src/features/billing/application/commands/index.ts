import { Type } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommandHandler } from './create-user';
import { AddFundsCommandHandler } from './add-funds';
import { DeductFundsCommandHandler } from './deduct-funds';
import { CancelPaymentCommandHandler } from './cancel-payment';
import { UpdateUserCommandHandler } from './update-user';

export const BILLING_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CreateUserCommandHandler,
  UpdateUserCommandHandler,
  AddFundsCommandHandler,
  DeductFundsCommandHandler,
  CancelPaymentCommandHandler,
];
