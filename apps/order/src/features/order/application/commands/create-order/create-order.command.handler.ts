import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { OrderEntity } from '../../../domain';
import { ProductRepository } from '../../../../product/infrastructure/repository';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand, { orderId: number }>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({
    orderDto: { userId, productIds },
  }: CreateOrderCommand): Promise<{ orderId: number }> {
    const newOrder = OrderEntity.create(userId);
    const products = await this.productRepository.getAll(productIds);
    newOrder.addProducts(products);
    await this.orderRepository.save(newOrder);
    return { orderId: newOrder.id };
  }
}
