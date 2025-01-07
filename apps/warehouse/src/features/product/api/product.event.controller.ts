import { Controller } from '@nestjs/common';
import { ProductFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ReserveProductContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';
import { CancelProductReservedContract } from '@app/amqp-contracts/queues/warehouse';

@Public()
@Controller()
export class ProductEventController {
  constructor(private readonly productFacade: ProductFacade) {}

  @RabbitSubscribe({
    exchange: ReserveProductContract.queue.exchange.name,
    routingKey: ReserveProductContract.queue.routingKey,
    queue: ReserveProductContract.queue.queue,
  })
  async reserveCourier(payload: ReserveProductContract.request): Promise<void> {
    await this.productFacade.commands.reserve(payload);
  }

  @RabbitSubscribe({
    exchange: CancelProductReservedContract.queue.exchange.name,
    routingKey: CancelProductReservedContract.queue.routingKey,
    queue: CancelProductReservedContract.queue.queue,
  })
  async cancelReserveCourier(
    payload: CancelProductReservedContract.request,
  ): Promise<void> {
    await this.productFacade.commands.cancelReserve(payload);
  }
}
