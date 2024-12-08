import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationCommand } from './registration.command';
import { UserRepository } from '../../../../user/infrastructure/repository';
import { UserEntity } from '../../../../user/domain/user';
import { hashPassword } from '@app/utils';
import { RegistrationUserEvent } from '../../../domain/events';

@CommandHandler(RegistrationCommand)
export class RegistrationCommandHandler
  implements ICommandHandler<RegistrationCommand, { userId: number }>
{
  private readonly logger = new Logger(RegistrationCommandHandler.name);

  constructor(
    private readonly eventBus: EventBus,
    private readonly userRepository: UserRepository,
  ) {}

  private async checkEmailOrUsername(emailOrUsername: string): Promise<void> {
    const checkEmailOrUsername =
      await this.userRepository.findByEmailOrUsername(emailOrUsername);
    if (checkEmailOrUsername) {
      throw new BadRequestException('Email or username already exists');
    }
  }

  async execute({
    registrationDto,
  }: RegistrationCommand): Promise<{ userId: number }> {
    const { email, username, password } = registrationDto;
    await this.checkEmailOrUsername(email);
    await this.checkEmailOrUsername(username);

    const passwordHash = await hashPassword(password);
    const newUser = UserEntity.create({ ...registrationDto, passwordHash });
    await this.userRepository.save(newUser);

    await this.eventBus.publish(new RegistrationUserEvent(newUser.id));
    return { userId: newUser.id };
  }
}
