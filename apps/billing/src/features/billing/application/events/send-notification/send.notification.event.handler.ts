import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { letterOfHappiness } from './letter-of-happiness';
import { letterOfGrief } from './letter-of-grief';
import { FundsOperationEvent } from '../../../domain/billing/events';
import { BillingRepository } from '../../../infrastructure/repository';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { NotificationMessageContract } from '@app/amqp-contracts/queues/billing';

@EventsHandler(FundsOperationEvent)
export class SendNotificationEventHandler
  implements IEventHandler<FundsOperationEvent>
{
  constructor(
    private readonly amqpConnection: AmqpConnection,
    private readonly userRepository: BillingRepository,
  ) {}
  async handle({ userId, orderId, result }: FundsOperationEvent) {
    const user = await this.userRepository.getUser(userId);
    const message = result ? letterOfHappiness : letterOfGrief;
    const payload = {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      content: message(orderId, user.fullName),
    };
    this.amqpConnection.publish(
      NotificationMessageContract.queue.exchange.name,
      NotificationMessageContract.queue.routingKey,
      payload,
    );
  }
}
