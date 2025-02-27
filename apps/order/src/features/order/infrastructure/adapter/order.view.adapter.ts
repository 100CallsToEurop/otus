import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { OrderViewRepository } from '../repository';
import { IOrderView, OrderViewEntity } from '../../domain/view';
import { IdempotencyEntity } from '@app/idempotency/domain';

@Injectable()
export class OrderViewAdapter implements OrderViewRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderViewEntity)
    private readonly orderRepository: Repository<OrderViewEntity>,
  ) {}
  async save(order: IOrderView): Promise<IOrderView> {
    return await this.orderRepository.save(order);
  }

  async getOrder(userId: number, orderId: number): Promise<IOrderView> {
    return await this.orderRepository.findOneBy({ userId, orderId });
  }

  async saveOrder(eventId: string, order: IOrderView): Promise<void> {
    await this.saveIdempotency(eventId, order);
  }

  async getOrderForUpdate(
    orderId: number,
    transactionId: string,
  ): Promise<IOrderView> {
    return await this.orderRepository.findOneBy({ orderId, transactionId });
  }

  async getByUserId(userId: number): Promise<[IOrderView[], number]> {
    return await this.orderRepository.findAndCount({
      where: { userId },
    });
  }

  private async saveIdempotency(
    eventId: string,
    order: IOrderView,
  ): Promise<void> {
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(OrderViewEntity).save(order);
    });
  }
}
