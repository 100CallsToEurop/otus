import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { PayOrderEvent } from '../../../domain/events';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(PayOrderEvent)
export class PaymentOrderEventHandler implements IEventHandler<PayOrderEvent> {
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  handle({ userId, orderId, amount }: PayOrderEvent) {
    const payload = JSON.stringify({
      userId,
      orderId,
      amount,
    });
    this.client.emit('deduct-funds', payload);
  }
}
