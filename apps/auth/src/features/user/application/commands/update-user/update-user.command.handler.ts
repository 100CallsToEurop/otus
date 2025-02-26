import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from './update-user.command';
import { Logger, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../../../infrastructure/repository';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand, void>
{
  private logger = new Logger(UpdateUserCommandHandler.name);
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, updateUserType }: UpdateUserCommand): Promise<void> {
    this.logger.log(`Update user ${userId}`);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.update(updateUserType);
    user.plainToInstance();
    await this.userRepository.updateUser(user);
  }
}
