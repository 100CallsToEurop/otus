import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddFundsCommand } from './add-funds.command';
import { UserRepository } from '../../../infrastructure/repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(AddFundsCommand)
export class AddFundsCommandHandler
  implements ICommandHandler<AddFundsCommand, { userId: number }>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    userId,
    amount,
  }: AddFundsCommand): Promise<{ userId: number }> {
    const user = await this.userRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.addWalletFunds(amount);
    console.log(user)
    await this.userRepository.save(user);
    return { userId: user.id };
  }
}
