import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FundsOperationEvent } from '../../../domain/billing/events';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(FundsOperationEvent)
export class SendResultOperationEventHandler
  implements IEventHandler<FundsOperationEvent>
{
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  async handle({ orderId, result }: FundsOperationEvent) {
    const payload = JSON.stringify({
      orderId,
      result,
    });
    this.client.emit('payment-confirmation', payload);
  }
}
