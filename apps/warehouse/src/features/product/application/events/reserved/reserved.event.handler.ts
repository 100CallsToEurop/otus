import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FailReservedProductEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { randomUUID } from 'crypto';

@EventsHandler(FailReservedProductEvent)
export class ReservedEventHandler implements IEventHandler<FailReservedProductEvent> {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, transactionId }: FailReservedProductEvent) {
    const request = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS,
        completed: false,
      },
    };
    const updateRequest = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.CANCELED,
        items: [],
        transactionMessage: 'Не удалось зарезервировать товары',
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
