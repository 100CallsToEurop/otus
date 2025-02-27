import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { DeductFundsCommand } from './deduct-funds.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { FailFundsOperationEvent } from '../../../domain/billing/events';
import { sleep } from '@app/utils';
import { Logger } from '@nestjs/common';

@CommandHandler(DeductFundsCommand)
export class DeductFundsCommandHandler
  implements ICommandHandler<DeductFundsCommand, void>
{
  private readonly logger = new Logger(DeductFundsCommandHandler.name);
  constructor(
    private readonly eventBus: EventBus,
    private readonly userRepository: BillingRepository,
  ) {}

  async execute({
    eventId,
    deductFundsDto: { userId, orderId, transactionId, amount },
  }: DeductFundsCommand): Promise<void> {
    this.logger.log(
      `списание средств userId: ${userId} orderId: ${orderId} в количестве ${amount}`,
    );
    const user = await this.userRepository.getUser(userId);

    await sleep(1000);
    const operation = user.deductWalletFunds(orderId, transactionId, amount);
    if (!operation) {
      this.eventBus.publish(
        new FailFundsOperationEvent(orderId, transactionId, userId),
      );
      await this.userRepository.saveUser(eventId, user);
      return;
    }
    await this.userRepository.saveOperation(
      eventId,
      orderId,
      transactionId,
      user,
    );
  }
}
