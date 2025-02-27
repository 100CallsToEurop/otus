import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IOrder, OrderEntity } from '../../domain';
import { OutboxEntity } from '@app/outbox/domain';
import { CancelPaymentConfirmationContract } from '@app/amqp-contracts/queues/billing';
import { CancelProductReservedContract } from '@app/amqp-contracts/queues/warehouse';
import {
  DeductFundsContract,
  ReserveCourierContract,
  ReserveProductContract,
} from '@app/amqp-contracts/queues/order';
import { IdempotencyEntity } from '@app/idempotency/domain';

@Injectable()
export class OrderAdapter implements OrderRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}
  async save(order: IOrder): Promise<IOrder> {
    return await this.orderRepository.save(order);
  }

  async saveOrder(eventId: string, order: IOrder): Promise<void> {
    await this.saveIdempotency(eventId, order);
  }

  async getById(
    orderId: number,
    transactionId: string,
  ): Promise<IOrder | null> {
    return await this.orderRepository.findOneBy({ orderId, transactionId });
  }

  async checkById(orderId: number): Promise<IOrder | null> {
    return await this.orderRepository.findOneBy({ orderId });
  }

  async cancelPaymentConfirmation(
    eventId: string,
    transactionId: string,
    order: IOrder,
  ): Promise<void> {
    const outboxPayload = {
      routingKey: CancelPaymentConfirmationContract.queue.routingKey,
      eventType: 'cancel.payment.confirmation',
      payload: {
        orderId: order.id,
        transactionId,
      },
    };
    await this.saveOperation(eventId, outboxPayload, order);
  }

  async cancelProductReserved(
    eventId: string,
    transactionId: string,
    order: IOrder,
  ): Promise<void> {
    const outboxPayload = {
      routingKey: CancelProductReservedContract.queue.routingKey,
      eventType: 'cancel.product.reserved',
      payload: {
        orderId: order.id,
        transactionId,
      },
    };
    await this.saveOperation(eventId, outboxPayload, order);
  }

  async deductFunds(eventId: string, order: IOrder): Promise<void> {
    const outboxPayload = {
      routingKey: DeductFundsContract.queue.routingKey,
      eventType: 'deduct.funds',
      payload: {
        userId: order.userId,
        orderId: order.orderId,
        transactionId: order.transactionId,
        amount: order.totalPrice,
      },
    };
    await this.saveOperation(eventId, outboxPayload, order);
  }
  async reserveProduct(eventId: string, order: IOrder): Promise<void> {
    const outboxPayload = {
      routingKey: ReserveProductContract.queue.routingKey,
      eventType: 'reserve.product',
      payload: {
        orderId: order.orderId,
        transactionId: order.transactionId,
        itemsIds: order.items,
      },
    };
    await this.saveOperation(eventId, outboxPayload, order);
  }
  async reserveCourier(eventId: string, order: IOrder): Promise<void> {
    const outboxPayload = {
      routingKey: ReserveCourierContract.queue.routingKey,
      eventType: 'reserve.courier',
      payload: {
        orderId: order.orderId,
        transactionId: order.transactionId,
        deliveryDate: order.deliveryDate,
      },
    };
    await this.saveOperation(eventId, outboxPayload, order);
  }

  private async saveOperation(
    eventId: string,
    outboxPayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    order: IOrder,
  ): Promise<void> {
    const outbox = OutboxEntity.create(outboxPayload);
    const idempotency = IdempotencyEntity.create({ eventId });
    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OutboxEntity).save(outbox);
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(OrderEntity).save(order);
    });
  }

  private async saveTransaction(
    outboxPayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    order: IOrder,
  ): Promise<void> {
    const outbox = OutboxEntity.create(outboxPayload);

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OutboxEntity).save(outbox);
      await manager.getRepository(OrderEntity).save(order);
    });
  }

  private async saveIdempotency(eventId: string, order: IOrder): Promise<void> {
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(OrderEntity).save(order);
    });
  }
}
