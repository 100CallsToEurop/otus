import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PayOrderEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { DeductFundsContract } from '@app/amqp-contracts/queues/order';

@EventsHandler(PayOrderEvent)
export class PaymentOrderEventHandler implements IEventHandler<PayOrderEvent> {
  constructor(private readonly amqpConnection: AmqpConnection) {}
  handle({ userId, orderId, amount }: PayOrderEvent) {
    const payload = {
      userId,
      orderId,
      amount,
    };
    this.amqpConnection.publish(
      DeductFundsContract.queue.exchange.name,
      DeductFundsContract.queue.routingKey,
      payload,
    );
  }
}
