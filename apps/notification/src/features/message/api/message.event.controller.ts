import { Controller } from '@nestjs/common';
import { MessageFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { NotificationMessageContract } from '@app/amqp-contracts/queues/billing';
import { Public } from '@app/common/decorators';

@Public()
@Controller()
export class MessageEventController {
  constructor(private readonly messageFacade: MessageFacade) {}

  @RabbitSubscribe({
    exchange: NotificationMessageContract.queue.exchange.name,
    routingKey: NotificationMessageContract.queue.routingKey,
    queue: NotificationMessageContract.queue.queue,
  })
  async createMessage(payload: NotificationMessageContract.request) {
    await this.messageFacade.commands.createMessage(payload);
  }
}
