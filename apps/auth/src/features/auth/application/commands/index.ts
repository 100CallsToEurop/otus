import { ICommandHandler } from '@nestjs/cqrs';
import { CheckCredentialsCommandHandler } from './check-credentials';
import { Type } from '@nestjs/common';
import { LogoutCommandHandler } from './logout';
import { LoginUserCommandHandler } from './login';
import { DeleteExpBadTokensCommandHandler } from './delete-expired-bad-token';
import { RegistrationCommandHandler } from './registration';
import { ValidateCommandHandler } from './validate';

export const AUTH_COMMAND_HANDLERS: Type<ICommandHandler>[] = [
  CheckCredentialsCommandHandler,
  LogoutCommandHandler,
  LoginUserCommandHandler,
  DeleteExpBadTokensCommandHandler,
  RegistrationCommandHandler,
  ValidateCommandHandler,
];
