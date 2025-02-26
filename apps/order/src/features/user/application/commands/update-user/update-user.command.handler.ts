import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { Logger } from '@nestjs/common';
import { OrderUserRepository } from '../../../infrastructure/repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, { userId: number }>
{
  private readonly logger = new Logger(UpdateUserCommandHandler.name);
  constructor(private readonly userRepository: OrderUserRepository) {}

  async execute({
    updateUserDto,
  }: UpdateUserCommand): Promise<{ userId: number }> {
    const { userId, ...updateUser } = updateUserDto;
    this.logger.log(
      `Update user: userId: ${userId}, email: ${updateUser.email}`,
    );
    const user = await this.userRepository.getUserById(userId);
    user.update(updateUser);
    await this.userRepository.save(user);
    return { userId };
  }
}
