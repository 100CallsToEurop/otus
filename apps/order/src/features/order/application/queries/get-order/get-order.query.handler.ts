import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrderQuery } from './get-order.query';
import { OrderViewResponse } from '../../../domain/view';
import { OrderViewRepository } from '../../../infrastructure/repository';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetOrderQuery)
export class GetOrderQueryHandler
  implements IQueryHandler<GetOrderQuery, OrderViewResponse>
{
  constructor(private readonly orderRepository: OrderViewRepository) {}

  async execute({ orderId }: GetOrderQuery): Promise<OrderViewResponse> {
    const order = await this.orderRepository.getOrder(orderId);
    if (!order) throw new NotFoundException('Order not found');
    return new OrderViewResponse(order);
  }
}
