import {
  RegistrationUserContract,
  UpdateUserContract,
} from '@app/amqp-contracts/queues/auth';
import { IdempotencyService } from '@app/idempotency';
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
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

  @RabbitRPC({
    exchange: RegistrationUserContract.queue.exchange.name,
    routingKey: RegistrationUserContract.queue.routingKey,
    queue: RegistrationUserContract.queue.queue,
  })
  async createUser(request: RegistrationUserContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.userFacade.commands.createUser(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitRPC({
    exchange: UpdateUserContract.queue.exchange.name,
    routingKey: UpdateUserContract.queue.routingKey,
    queue: UpdateUserContract.queue.queue,
  })
  async updateUser(request: UpdateUserContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.userFacade.commands.updateUser(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
