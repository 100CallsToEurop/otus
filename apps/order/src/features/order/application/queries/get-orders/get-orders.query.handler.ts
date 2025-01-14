import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from './get-orders.query';
import { OrderViewResponse } from '../../../domain/view';
import { OrderViewRepository } from '../../../infrastructure/repository';

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler
  implements IQueryHandler<GetOrdersQuery, OrderViewResponse[]>
{
  constructor(private readonly orderRepository: OrderViewRepository) {}

  async execute({ userId }: GetOrdersQuery): Promise<OrderViewResponse[]> {
    const [orders, count] = await this.orderRepository.getByUserId(userId);
    if (!count) return [];
    return orders.map((order) => new OrderViewResponse(order));
  }
}
