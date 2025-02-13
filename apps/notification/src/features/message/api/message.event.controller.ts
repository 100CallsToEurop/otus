import { Controller } from '@nestjs/common';
import { MessageFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { NotificationMessageContract } from '@app/amqp-contracts/queues/billing';
import { Public } from '@app/common/decorators';
import { IdempotencyService } from '@app/idempotency';

@Public()
@Controller()
export class MessageEventController {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly messageFacade: MessageFacade,
  ) {}

  @RabbitSubscribe({
    exchange: NotificationMessageContract.queue.exchange.name,
    routingKey: NotificationMessageContract.queue.routingKey,
    queue: NotificationMessageContract.queue.queue,
  })
  async createMessage(request: NotificationMessageContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.messageFacade.commands.createMessage(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
