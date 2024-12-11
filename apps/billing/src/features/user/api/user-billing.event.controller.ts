import { Controller } from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { RegistrationUserContract } from '@app/amqp-contracts/queues/auth';
import { DeductFundsContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';

@Public()
@Controller()
export class BillingEventController {
  constructor(private readonly productFacade: UserBillingFacade) {}

  @RabbitSubscribe({
    exchange: RegistrationUserContract.queue.exchange.name,
    routingKey: RegistrationUserContract.queue.routingKey,
    queue: RegistrationUserContract.queue.queue,
  })
  async createUser(payload: RegistrationUserContract.request): Promise<void> {
    try {
      await this.productFacade.commands.createUser(payload);
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: DeductFundsContract.queue.exchange.name,
    routingKey: DeductFundsContract.queue.routingKey,
    queue: DeductFundsContract.queue.queue,
  })
  async deductFunds(payload: DeductFundsContract.request): Promise<void> {
    await this.productFacade.commands.deductFunds(payload);
  }
}
