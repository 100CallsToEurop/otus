import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelPaymentCommand } from './cancel-payment.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { Logger } from '@nestjs/common';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentCommandHandler
  implements ICommandHandler<CancelPaymentCommand, void>
{
  private readonly logger = new Logger(CancelPaymentCommandHandler.name);
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    cancelPaymentDto: { orderId, transactionId },
  }: CancelPaymentCommand): Promise<void> {
    this.logger.log(`Возврат списанных средств ordetId: ${orderId}`);
    const user = await this.userRepository.getUserByTransactionId(
      orderId,
      transactionId,
    );
    if (!user) return;
    user.cancelTransaction(orderId, transactionId);
    await this.userRepository.save(user);
  }
}
