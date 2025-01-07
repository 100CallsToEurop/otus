import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderViewRepository } from '../repository';
import { IOrderView, OrderViewEntity } from '../../domain/view';

@Injectable()
export class OrderViewAdapter implements OrderViewRepository {
  constructor(
    @InjectRepository(OrderViewEntity)
    private readonly orderRepository: Repository<OrderViewEntity>,
  ) {}
  async save(order: IOrderView): Promise<IOrderView> {
    return await this.orderRepository.save(order);
  }

  async getOrder(orderId: number): Promise<IOrderView> {
    return await this.orderRepository.findOneBy({ id: orderId });
  }
}
