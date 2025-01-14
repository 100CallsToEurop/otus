import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ReservedEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { STATUS_ORDER } from '@app/consts';

@EventsHandler(ReservedEvent)
export class ReservedEventHandler implements IEventHandler<ReservedEvent> {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({
    orderId,
    transactionId,
    reserved,
    courierFullName,
  }: ReservedEvent) {
    const payload = {
      orderId,
      transactionId,
      status: STATUS_ORDER.WAITING_FOR_RESERVE_COURIER,
      completed: reserved,
    };
    const updatePayload = {
      orderId,
      transactionId,
      status: reserved
        ? STATUS_ORDER.WAITING_FOR_RESERVE_COURIER
        : STATUS_ORDER.CANCELED,
      courierFullName: reserved ? courierFullName : '',
      transactionMessage: reserved ? '' : 'Не удалось зарезервировать курьера',
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
