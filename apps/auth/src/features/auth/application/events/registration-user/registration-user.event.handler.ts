import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RegistrationUserEvent } from '../../../domain/events';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { RegistrationUserContract } from '@app/amqp-contracts/queues/auth';

@EventsHandler(RegistrationUserEvent)
export class RegistrationUserEventHandler
  implements IEventHandler<RegistrationUserEvent>
{
  constructor(private readonly amqpConnection: AmqpConnection) {}
  handle({ userId, email, fullName }: RegistrationUserEvent) {
    this.amqpConnection.publish(
      RegistrationUserContract.queue.exchange.name,
      RegistrationUserContract.queue.routingKey,
      { userId, email, fullName },
    );
  }
}
