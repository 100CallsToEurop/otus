import { Controller } from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RegistrationUserContract } from '@app/amqp-contracts/queues/auth';
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

  @RabbitSubscribe({
    exchange: DeductFundsContract.queue.exchange.name,
    routingKey: DeductFundsContract.queue.routingKey,
    queue: DeductFundsContract.queue.queue,
  })
  async deductFunds(request: DeductFundsContract.request): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.userFacade.commands.deductFunds(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: CancelPaymentConfirmationContract.queue.exchange.name,
    routingKey: CancelPaymentConfirmationContract.queue.routingKey,
    queue: CancelPaymentConfirmationContract.queue.queue,
  })
  async cancelPayment(
    request: CancelPaymentConfirmationContract.request,
  ): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.userFacade.commands.cancelPayment(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
