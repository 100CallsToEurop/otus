import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { letterOfHappiness } from './letter-of-happiness';
import { letterOfGrief } from './letter-of-grief';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { NotificationMessageContract } from '@app/amqp-contracts/queues/billing';
import { OrderUserRepository } from '../../../infrastructure/repository';
import { OrderReadyEvent } from '../../../domain/events';
import { randomUUID } from 'crypto';

@EventsHandler(OrderReadyEvent)
export class SendNotificationEventHandler
  implements IEventHandler<OrderReadyEvent>
{
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly userRepository: OrderUserRepository,
  ) {}
  async handle({ userId, orderId, result }: OrderReadyEvent) {
    const user = await this.userRepository.getUserById(userId);
    const message = result ? letterOfHappiness : letterOfGrief;

    const request = {
      eventId: randomUUID(),
      payload: {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        content: message(orderId, user.fullName),
      },
    };
    this.amqpConnection.publish(
      NotificationMessageContract.queue.exchange.name,
      NotificationMessageContract.queue.routingKey,
      request,
    );
  }
}
