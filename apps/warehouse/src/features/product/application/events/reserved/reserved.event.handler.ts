import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservedEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { ProductResponse } from '../../../domain/product';

@EventsHandler(ReservedEvent)
export class ReservedEventHandler implements IEventHandler<ReservedEvent> {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, transactionId, reserved, items }: ReservedEvent) {
    const payload = {
      orderId,
      transactionId,
      status: STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS,
      completed: reserved,
    };
    const updatePayload = {
      orderId,
      transactionId,
      status: reserved
        ? STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS
        : STATUS_ORDER.CANCELED,
      items: items.map((item) => new ProductResponse(item)),
      transactionMessage: reserved ? '' : 'Не удалось зарезервировать товары',
    };
    this.amqpConnection.publish(
      PlaceOrderContract.queue.exchange.name,
      PlaceOrderContract.queue.routingKey,
      payload,
    );
    this.amqpConnection.publish(
      UpdateViewOrderContract.queue.exchange.name,
      UpdateViewOrderContract.queue.routingKey,
      updatePayload,
    );
  }
}
