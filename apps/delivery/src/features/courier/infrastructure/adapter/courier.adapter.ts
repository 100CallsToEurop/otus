import { Injectable, Logger } from '@nestjs/common';
import { CourierRepository } from '../repository';
import { CourierEntity, ICourier } from '../../domain/courier';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, IsNull, Not, Repository } from 'typeorm';
import { OutboxEntity } from '@app/outbox/domain';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { STATUS_ORDER } from '@app/consts';
import { IdempotencyEntity } from '@app/idempotency/domain';

@Injectable()
export class CourierAdapter implements CourierRepository {
  private readonly logger = new Logger(CourierAdapter.name);

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CourierEntity)
    private readonly courierRepository: Repository<CourierEntity>,
  ) {}
  async save(courier: ICourier): Promise<ICourier> {
    return await this.courierRepository.save(courier);
  }

  async saveCourier(eventId: string): Promise<void> {
    await this.saveIdempotency(eventId);
  }
  async getFreeCourier(checkDate: Date): Promise<ICourier | null> {
    const cd = new Date(checkDate);
    const startOfDay = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);

    const freeCouriers = await this.courierRepository.find({
      where: {
        availabilitySlots: [
          {
            id: IsNull(),
          },
          {
            date: Not(Between(startOfDay, endOfDay)),
          },
        ],
      },
      relations: { availabilitySlots: true },
    });
    if (!freeCouriers.length) return null;
    return freeCouriers[0];
  }
  async getCourierByOrderId(
    orderId: number,
    transactionId: string,
  ): Promise<ICourier | null> {
    return await this.courierRepository.findOne({
      where: {
        availabilitySlots: {
          orderId,
          transactionId,
        },
      },
      relations: { availabilitySlots: true },
    });
  }

  async getAllCouriers(): Promise<ICourier[]> {
    return await this.courierRepository.find({
      relations: { availabilitySlots: true },
    });
  }

  async reserveCourier(
    eventId: string,
    orderId: number,
    transactionId: string,
    courier: ICourier,
  ): Promise<void> {
    const outboxPayload = {
      routingKey: PlaceOrderContract.queue.routingKey,
      eventType: 'courier.reserved',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_COURIER,
        completed: true,
      },
    };

    const updatePayload = {
      routingKey: UpdateViewOrderContract.queue.routingKey,
      eventType: 'update.view.courier',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_COURIER,
        courierFullName: courier.fullName,
        transactionMessage: '',
      },
    };

    await this.saveOperationTransaction(
      eventId,
      outboxPayload,
      updatePayload,
      courier,
    );
  }

  private async saveOperationTransaction(
    eventId: string,
    outboxPayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    updatePayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    courier: ICourier,
  ): Promise<void> {
    const outbox = OutboxEntity.create(outboxPayload);
    const outboxUpdate = OutboxEntity.create(updatePayload);
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OutboxEntity).save(outbox);
      await manager.getRepository(OutboxEntity).save(outboxUpdate);
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(CourierEntity).save(courier);
    });
  }

  private async saveIdempotency(eventId: string): Promise<void> {
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(IdempotencyEntity).save(idempotency);
    });
  }
}
