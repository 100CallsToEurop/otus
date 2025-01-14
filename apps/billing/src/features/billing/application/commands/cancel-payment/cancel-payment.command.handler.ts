import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelPaymentCommand } from './cancel-payment.command';
import { BillingRepository } from '../../../infrastructure/repository';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentCommandHandler
  implements ICommandHandler<CancelPaymentCommand, void>
{
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    cancelPaymentDto: { orderId, transactionId },
  }: CancelPaymentCommand): Promise<void> {
    const user = await this.userRepository.getUserByTransactionId(
      orderId,
      transactionId,
    );
    if (!user) return;
    user.cancelTransaction(orderId, transactionId);
    await this.userRepository.save(user);
  }
}
