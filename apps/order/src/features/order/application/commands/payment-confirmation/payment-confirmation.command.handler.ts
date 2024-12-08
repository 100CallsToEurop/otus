import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PaymentConfirmationCommand } from './payment-confirmation.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { STATUS_ORDER } from 'apps/order/src/const';

@CommandHandler(PaymentConfirmationCommand)
export class PaymentConfirmationCommandHandler
  implements ICommandHandler<PaymentConfirmationCommand, void>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    paymentConfirmationDto: { orderId, status },
  }: PaymentConfirmationCommand): Promise<void> {
    const order = await this.orderRepository.getById(orderId);
    const status_order = status
      ? STATUS_ORDER.COMPLETED
      : STATUS_ORDER.CANCELLED;
    order.setStatus(status_order);
    await this.orderRepository.save(order);
  }
}
