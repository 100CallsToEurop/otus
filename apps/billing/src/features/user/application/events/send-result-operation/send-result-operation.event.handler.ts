import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { FundsOperationEvent } from '../../../domain/billing/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PaymentConfirmationContract } from '@app/amqp-contracts/queues/billing/payment-confirmation.contract';

@EventsHandler(FundsOperationEvent)
export class SendResultOperationEventHandler
  implements IEventHandler<FundsOperationEvent>
{
  constructor(private readonly amqpConnection: AmqpConnection) {}
  async handle({ orderId, result }: FundsOperationEvent) {
    const payload = {
      orderId,
      result,
    };
    this.amqpConnection.publish(
      PaymentConfirmationContract.queue.exchange.name,
      PaymentConfirmationContract.queue.routingKey,
      payload,
    );
  }
}
