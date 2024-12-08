import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { letterOfHappiness } from './letter-of-happiness';
import { letterOfGrief } from './letter-of-grief';
import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { FundsOperationEvent } from '../../../domain/user/events';
import { UserRepository } from '../../../infrastructure/repository';

@EventsHandler(FundsOperationEvent)
export class SendNotificationEventHandler
  implements IEventHandler<FundsOperationEvent>
{
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly userRepository: UserRepository,
  ) {}
  async handle({ userId, orderId, result }: FundsOperationEvent) {
    const user = await this.userRepository.getUser(userId);
    const message = result ? letterOfHappiness : letterOfGrief;
    const payload = JSON.stringify({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      content: message(orderId, user.fullName),
    });
    this.client.emit('notification-message', payload);
  }
}
