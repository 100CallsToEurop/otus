import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AddFundsCommand } from './add-funds.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(AddFundsCommand)
export class AddFundsCommandHandler
  implements ICommandHandler<AddFundsCommand, { userId: number }>
{
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    userId,
    amount,
  }: AddFundsCommand): Promise<{ userId: number }> {
    console.log(userId, amount);
    const user = await this.userRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.addWalletFunds(amount);
    await this.userRepository.save(user);
    return { userId: user.id };
  }
}
