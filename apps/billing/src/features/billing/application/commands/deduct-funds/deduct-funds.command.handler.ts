import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeductFundsCommand } from './deduct-funds.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { FundsOperationEvent } from '../../../domain/billing/events';
import { sleep } from '@app/utils';

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

    await sleep(1000);

    const operation = user.deductWalletFunds(orderId, amount);
    operation && (await this.userRepository.save(user));

    await this.eventBus.publish(
      new FundsOperationEvent(userId, orderId, operation),
    );
  }
}
