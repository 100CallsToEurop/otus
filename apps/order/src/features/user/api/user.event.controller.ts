import { RegistrationUserContract } from '@app/amqp-contracts/queues/auth';
import { IdempotencyService } from '@app/idempotency';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Controller } from '@nestjs/common';
import { OrderUserFacade } from '../application';
import { Public } from '@app/common/decorators';

@Public()
@Controller()
export class UserEventController {
  constructor(
    private readonly userFacade: OrderUserFacade,
    private readonly idempotencyService: IdempotencyService,
  ) {}

  @RabbitSubscribe({
    exchange: RegistrationUserContract.queue.exchange.name,
    routingKey: RegistrationUserContract.queue.routingKey,
    queue: RegistrationUserContract.queue.queue,
  })
  async createUser(request: RegistrationUserContract.request): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.userFacade.commands.createUser(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
