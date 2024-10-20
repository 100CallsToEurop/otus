import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { Logger } from '@nestjs/common';
import { UserEntity } from '../../../domain';
import { UserRepository } from '../../../infrastructure/repository';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, void>
{
  private logger = new Logger(CreateUserCommandHandler.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ createUser }: CreateUserCommand): Promise<void> {
    this.logger.log(`Create user ${createUser.username}`);
    const newUser = UserEntity.create(createUser);
    newUser.plainToInstance();
    await this.userRepository.save(newUser);
  }
}
