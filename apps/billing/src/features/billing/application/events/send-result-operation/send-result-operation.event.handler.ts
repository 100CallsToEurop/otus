import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FailFundsOperationEvent } from '../../../domain/billing/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { randomUUID } from 'crypto';

@EventsHandler(FailFundsOperationEvent)
export class SendResultOperationEventHandler
  implements IEventHandler<FailFundsOperationEvent>
{
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, transactionId }: FailFundsOperationEvent) {
    const request = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_PAYMENT,
        completed: false,
      },
    };
    const updateRequest = {
      eventId: randomUUID(),
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.CANCELED,
        transactionMessage: 'Не удалось списать средства',
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
