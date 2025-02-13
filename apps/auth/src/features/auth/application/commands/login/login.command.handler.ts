import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { TokensService } from '../../services';
import { LoginUserCommand } from './login.user.command';
import { Logger } from '@nestjs/common';
import { LoginResponseDto } from './login.response.dto';
import { UserRepository } from '../../../../user/infrastructure/repository';
import { LoginUserEvent } from '../../../../auth/domain/events';

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand>
{
  private readonly logger = new Logger(LoginUserCommandHandler.name);
  constructor(
    private readonly tokensService: TokensService,
    private readonly userRepository: UserRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute({
    ip,
    user_agent,
    ...payload
  }: LoginUserCommand): Promise<LoginResponseDto> {
    const user = await this.userRepository.findById(payload.userId);
    const newTokens = await this.tokensService.createNewTokens({
      ...payload,
      role: user.role,
    });

    const { userId, iat, exp, deviceId } = await this.tokensService.decodeToken(
      newTokens.refreshToken,
    );

    await this.userRepository.save(user);
    await this.eventBus.publish(
      new LoginUserEvent(userId, deviceId, ip, user_agent, exp, iat),
    );
    return newTokens;
  }
}
