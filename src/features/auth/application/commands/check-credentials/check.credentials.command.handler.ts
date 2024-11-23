import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger, UnauthorizedException } from '@nestjs/common';
import { CheckCredentialsCommand } from './check.credentials.command';
import { UserRepository } from '../../../../user/infrastructure/repository';
import { isHashedEquals } from '@app/utils';

@CommandHandler(CheckCredentialsCommand)
export class CheckCredentialsCommandHandler
  implements ICommandHandler<CheckCredentialsCommand>
{
  private readonly logger = new Logger(CheckCredentialsCommandHandler.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    checkCredentialsDto: { email, password },
  }: CheckCredentialsCommand): Promise<number> {
    const user = await this.userRepository.findByEmailOrUsername(
      email.toLowerCase(),
    );
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }
    if (await isHashedEquals(password, user.passwordHash)) {
      return user.id;
    }
    throw new UnauthorizedException('Unauthorized');
  }
}
