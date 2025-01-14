import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FundsOperationEvent } from '../../../domain/billing/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';

@EventsHandler(FundsOperationEvent)
export class SendResultOperationEventHandler
  implements IEventHandler<FundsOperationEvent>
{
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, transactionId, result }: FundsOperationEvent) {
    const payload = {
      orderId,
      transactionId,
      status: STATUS_ORDER.WAITING_FOR_PAYMENT,
      completed: result,
    };
    const updatePayload = {
      orderId,
      transactionId,
      status: result ? STATUS_ORDER.WAITING_FOR_PAYMENT : STATUS_ORDER.CANCELED,
      transactionMessage: result ? '' : 'Не удалось списать средства',
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
