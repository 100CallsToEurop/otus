import { Controller } from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  RegistrationUserContract,
  UpdateUserContract,
} from '@app/amqp-contracts/queues/auth';
import { DeductFundsContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';
import { CancelPaymentConfirmationContract } from '@app/amqp-contracts/queues/billing';
import { IdempotencyService } from '@app/idempotency';

@Public()
@Controller()
export class BillingEventController {
  constructor(
    private readonly userFacade: UserBillingFacade,
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

  @RabbitRPC({
    exchange: DeductFundsContract.queue.exchange.name,
    routingKey: DeductFundsContract.queue.routingKey,
    queue: DeductFundsContract.queue.queue,
  })
  async deductFunds(request: DeductFundsContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.userFacade.commands.deductFunds(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitRPC({
    exchange: CancelPaymentConfirmationContract.queue.exchange.name,
    routingKey: CancelPaymentConfirmationContract.queue.routingKey,
    queue: CancelPaymentConfirmationContract.queue.queue,
  })
  async cancelPayment(request: CancelPaymentConfirmationContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.userFacade.commands.cancelPayment(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
