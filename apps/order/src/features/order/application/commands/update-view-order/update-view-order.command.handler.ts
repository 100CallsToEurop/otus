import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateViewOrderCommand } from './update-view-order.command';
import { OrderViewRepository } from '../../../infrastructure/repository';

@CommandHandler(UpdateViewOrderCommand)
export class UpdateViewOrderCommandHandler
  implements ICommandHandler<UpdateViewOrderCommand, void>
{
  constructor(private readonly orderViewRepository: OrderViewRepository) {}

  async execute({
    orderDto: { orderId, ...updateOrder },
  }: UpdateViewOrderCommand): Promise<void> {
    const order = await this.orderViewRepository.getOrder(orderId);
    order.update(updateOrder);
    await this.orderViewRepository.save(order);
  }
}
