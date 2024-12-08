import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { RegistrationUserEvent } from '../../../domain/events';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@EventsHandler(RegistrationUserEvent)
export class RegistrationUserEventHandler
  implements IEventHandler<RegistrationUserEvent>
{
  constructor(@Inject('KAFKA_SERVICE') private readonly client: ClientKafka) {}
  handle({ userId }: RegistrationUserEvent) {
    this.client.emit(
      'user-created',
      JSON.stringify({
        userId,
      }),
    );
  }
}
