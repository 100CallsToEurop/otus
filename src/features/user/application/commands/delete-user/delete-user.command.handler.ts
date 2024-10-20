import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from './delete-user.command';
import { Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/repository';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand, void>
{
  private logger = new Logger(DeleteUserCommandHandler.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId }: DeleteUserCommand): Promise<void> {
    this.logger.log(`Delete user ${userId}`);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepository.delete(userId);
  }
}
