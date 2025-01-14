import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrder, OrderEntity } from '../../domain';

@Injectable()
export class OrderAdapter implements OrderRepository {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}
  async save(order: IOrder): Promise<IOrder> {
    return await this.orderRepository.save(order);
  }

  async getById(
    orderId: number,
    transactionId: string,
  ): Promise<IOrder | null> {
    return await this.orderRepository.findOneBy({ orderId, transactionId });
  }
}
