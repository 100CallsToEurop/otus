import { Controller } from '@nestjs/common';
import { ProductFacade } from '../application';
import { Nack, RabbitRPC } from '@golevelup/nestjs-rabbitmq';
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

  @RabbitRPC({
    exchange: ReserveProductContract.queue.exchange.name,
    routingKey: ReserveProductContract.queue.routingKey,
    queue: ReserveProductContract.queue.queue,
  })
  async reserveProduct(request: ReserveProductContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.productFacade.commands.reserve(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitRPC({
    exchange: CancelProductReservedContract.queue.exchange.name,
    routingKey: CancelProductReservedContract.queue.routingKey,
    queue: CancelProductReservedContract.queue.queue,
  })
  async cancelReserveCourier(request: CancelProductReservedContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (idempotency) return new Nack();
      if (!idempotency) {
        await this.productFacade.commands.cancelReserve(
          request.eventId,
          request.payload,
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
}
