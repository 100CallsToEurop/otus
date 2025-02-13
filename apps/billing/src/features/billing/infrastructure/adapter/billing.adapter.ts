import { Injectable } from '@nestjs/common';
import { BillingRepository } from '../repository';
import { IBilling } from '../../domain/billing/billing.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BillingEntity } from '../../domain/billing/billing.entity';
import { DataSource, Repository } from 'typeorm';
import { OutboxEntity } from '@app/outbox/domain';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { STATUS_ORDER } from '@app/consts';

@Injectable()
export class BillingAdapter implements BillingRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(BillingEntity)
    private readonly billingRepository: Repository<BillingEntity>,
  ) {}
  async save(billing: IBilling): Promise<IBilling> {
    return await this.billingRepository.save(billing);
  }

  async getUser(userId: number): Promise<IBilling | null> {
    return await this.billingRepository.findOne({
      where: { id: userId },
      relations: { wallet: true, histories: true },
    });
  }
  async getUserByTransactionId(
    orderId: number,
    transactionId: string,
  ): Promise<IBilling> {
    return await this.billingRepository.findOne({
      where: { histories: { orderId, transactionId } },
      relations: { wallet: true, histories: true },
    });
  }

  async saveOperation(
    orderId: number,
    transactionId: string,
    billing: IBilling,
  ): Promise<void> {
    const outboxPayload = {
      routingKey: PlaceOrderContract.queue.routingKey,
      eventType: 'billing.operation',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_PAYMENT,
        completed: true,
      },
    };
    const updatePayload = {
      routingKey: UpdateViewOrderContract.queue.routingKey,
      eventType: 'update.view.billing',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_PAYMENT,
        transactionMessage: '',
      },
    };
    await this.saveTransaction(outboxPayload, billing);
    await this.saveTransaction(updatePayload, billing);
  }

  private async saveTransaction(
    outboxPayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    billing: IBilling,
  ): Promise<void> {
    const outbox = OutboxEntity.create(outboxPayload);

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OutboxEntity).save(outbox);
      await manager.getRepository(BillingEntity).save(billing);
    });
  }
}
