import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from './get-orders.query';
import { OrderResponse } from '../../../domain';
import { OrderRepository } from '../../../infrastructure/repository';

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler
  implements IQueryHandler<GetOrdersQuery, OrderResponse[]>
{
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ userId }: GetOrdersQuery): Promise<OrderResponse[]> {
    const orders = await this.orderRepository.getAll(userId);
    if (!orders.length) return [];
    return orders.map((order) => new OrderResponse(order));
  }
}
