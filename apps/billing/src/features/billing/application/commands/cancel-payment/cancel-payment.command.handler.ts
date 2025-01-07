import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelPaymentCommand } from './cancel-payment.command';
import { BillingRepository } from '../../../infrastructure/repository';

@CommandHandler(CancelPaymentCommand)
export class CancelPaymentCommandHandler
  implements ICommandHandler<CancelPaymentCommand, void>
{
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    cancelPaymentDto: { orderId },
  }: CancelPaymentCommand): Promise<void> {
    const user = await this.userRepository.getUserByOrderId(orderId);
    if (!user) return;
    user.cancelTransaction(orderId);
    await this.userRepository.save(user);
  }
}
