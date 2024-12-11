import { Controller } from '@nestjs/common';
import { OrderFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { PaymentConfirmationContract } from '@app/amqp-contracts/queues/billing/payment-confirmation.contract';
import { Public } from '@app/common/decorators';

@Public()
@Controller()
export class OrderEventController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @RabbitSubscribe({
    exchange: PaymentConfirmationContract.queue.exchange.name,
    routingKey: PaymentConfirmationContract.queue.routingKey,
    queue: PaymentConfirmationContract.queue.queue,
  })
  async PaymentConfirmation( payload: PaymentConfirmationContract.request) {
    await this.orderFacade.commands.paymentConfirmation(payload);
  }
}
