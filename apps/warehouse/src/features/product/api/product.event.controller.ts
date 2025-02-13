import { Controller } from '@nestjs/common';
import { ProductFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ReserveProductContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';
import { CancelProductReservedContract } from '@app/amqp-contracts/queues/warehouse';
import { IdempotencyService } from '@app/idempotency';

@Public()
@Controller()
export class ProductEventController {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly productFacade: ProductFacade,
  ) {}

  @RabbitSubscribe({
    exchange: ReserveProductContract.queue.exchange.name,
    routingKey: ReserveProductContract.queue.routingKey,
    queue: ReserveProductContract.queue.queue,
  })
  async reserveCourier(request: ReserveProductContract.request): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.productFacade.commands.reserve(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: CancelProductReservedContract.queue.exchange.name,
    routingKey: CancelProductReservedContract.queue.routingKey,
    queue: CancelProductReservedContract.queue.queue,
  })
  async cancelReserveCourier(
    request: CancelProductReservedContract.request,
  ): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.productFacade.commands.cancelReserve(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
