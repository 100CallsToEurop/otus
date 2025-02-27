import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FailReservedCourierEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { STATUS_ORDER } from '@app/consts';
import { randomUUID } from 'crypto';

@EventsHandler(FailReservedCourierEvent)
export class ReservedEventHandler implements IEventHandler<FailReservedCourierEvent> {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, transactionId }: FailReservedCourierEvent) {
    const request = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_COURIER,
        completed: false,
      },
    };
    const updateRequest = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.CANCELED,
        courierFullName: '',
        transactionMessage: 'Не удалось зарезервировать курьера',
      },
    };
    this.amqpConnection.publish(
      PlaceOrderContract.queue.exchange.name,
      PlaceOrderContract.queue.routingKey,
      request,
    );
    this.amqpConnection.publish(
      UpdateViewOrderContract.queue.exchange.name,
      UpdateViewOrderContract.queue.routingKey,
      updateRequest,
    );
  }
}
