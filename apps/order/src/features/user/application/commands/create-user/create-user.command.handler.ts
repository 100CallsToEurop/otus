import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { OrderUserRepository } from '../../../infrastructure/repository';
import { OrderUserEntity } from '../../../domain';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, void>
{
  private readonly logger = new Logger(CreateUserCommandHandler.name);
  constructor(private readonly userRepository: OrderUserRepository) {}

  async execute({ createUserDto }: CreateUserCommand): Promise<void> {
    this.logger.log(
      `Create user: userId: ${createUserDto.userId}, email: ${createUserDto.email}`,
    );
    const newUser = OrderUserEntity.create({
      ...createUserDto,
      id: createUserDto.userId,
    });
    await this.userRepository.save(newUser);
  }
}
