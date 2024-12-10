import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeductFundsCommand } from './deduct-funds.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { FundsOperationEvent } from '../../../domain/billing/events';

@CommandHandler(DeductFundsCommand)
export class DeductFundsCommandHandler
  implements ICommandHandler<DeductFundsCommand, void>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly userRepository: BillingRepository,
  ) {}

  async execute({
    deductFundsDto: { userId, orderId, amount },
  }: DeductFundsCommand): Promise<void> {
    const user = await this.userRepository.getUser(userId);
    const operation = user.deductWalletFunds(amount);
    operation && (await this.userRepository.save(user));

    await this.eventBus.publish(
      new FundsOperationEvent(userId, orderId, operation),
    );
  }
}
