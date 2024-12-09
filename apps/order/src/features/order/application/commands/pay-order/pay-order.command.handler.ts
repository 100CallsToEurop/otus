import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PayOrderCommand } from './pay-order.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { NotFoundException } from '@nestjs/common';
import { STATUS_ORDER } from '../../../../../const';
import { PayOrderEvent } from '../../../domain/events';

@CommandHandler(PayOrderCommand)
export class PayOrderCommandHandler
  implements ICommandHandler<PayOrderCommand, { orderId: number }>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({
    userId,
    orderId,
  }: PayOrderCommand): Promise<{ orderId: number }> {
    const order = await this.orderRepository.getByUser(userId, orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.setStatus(STATUS_ORDER.PENDING);
    const amount = order.totalPrice;
    await this.orderRepository.save(order);
    await this.eventBus.publish(new PayOrderEvent(userId, orderId, amount));
    return { orderId: order.id };
  }
}
