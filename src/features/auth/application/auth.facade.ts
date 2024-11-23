import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CheckCredentialsDto as CheckCredentialsDto } from './commands/check-credentials/check.credentials.dto';
import {
  LoginDto,
  LoginUserCommand,
  LoginUserCommandHandler,
} from './commands/login';
import {
  CheckCredentialsCommandHandler,
  CheckCredentialsCommand,
} from './commands/check-credentials';
import { LogoutCommand, LogoutCommandHandler } from './commands/logout';
import {
  DeleteExpBadTokensCommand,
  DeleteExpBadTokensCommandHandler,
} from './commands/delete-expired-bad-token';
import {
  RegistrationCommand,
  RegistrationCommandHandler,
  RegistrationDto,
} from './commands/registration';

export class AuthFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    registration: (registrationDto: RegistrationDto) =>
      this.registrationUser(registrationDto),
    checkCredentials: (checkCredentialsDto: CheckCredentialsDto) =>
      this.checkCredentials(checkCredentialsDto),
    deleteExpiredBadToken: () => this.deleteExpiredBadToken(),
    login: (device: LoginDto) => this.login(device),
    logout: (userId: number, deviceId: string) => this.logout(userId, deviceId),
  };

  private registrationUser(registrationDto: RegistrationDto) {
    return this.commandBus.execute<
      RegistrationCommand,
      Awaited<ReturnType<RegistrationCommandHandler['execute']>>
    >(new RegistrationCommand(registrationDto));
  }

  private checkCredentials(checkCredentialsDto: CheckCredentialsDto) {
    return this.commandBus.execute<
      CheckCredentialsCommand,
      Awaited<ReturnType<CheckCredentialsCommandHandler['execute']>>
    >(new CheckCredentialsCommand(checkCredentialsDto));
  }

  private deleteExpiredBadToken() {
    return this.commandBus.execute<
      DeleteExpBadTokensCommand,
      Awaited<ReturnType<DeleteExpBadTokensCommandHandler['execute']>>
    >(new DeleteExpBadTokensCommand());
  }

  private login(device: LoginDto) {
    return this.commandBus.execute<
      LoginUserCommand,
      Awaited<ReturnType<LoginUserCommandHandler['execute']>>
    >(new LoginUserCommand(device));
  }

  private logout(userId: number, deviceId: string) {
    return this.commandBus.execute<
      LogoutCommand,
      Awaited<ReturnType<LogoutCommandHandler['execute']>>
    >(new LogoutCommand(userId, deviceId));
  }
}
