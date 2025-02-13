import { Controller } from '@nestjs/common';
import { OrderFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Public } from '@app/common/decorators';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { IdempotencyService } from '@app/idempotency';

@Public()
@Controller()
export class OrderEventController {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly orderFacade: OrderFacade,
  ) {}

  @RabbitSubscribe({
    exchange: PlaceOrderContract.queue.exchange.name,
    routingKey: PlaceOrderContract.queue.routingKey,
    queue: PlaceOrderContract.queue.queue,
  })
  async placeOrder(request: PlaceOrderContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.orderFacade.commands.placeOrder(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }

  @RabbitSubscribe({
    exchange: UpdateViewOrderContract.queue.exchange.name,
    routingKey: UpdateViewOrderContract.queue.routingKey,
    queue: UpdateViewOrderContract.queue.queue,
  })
  async updateViewOrder(request: UpdateViewOrderContract.request) {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.orderFacade.commands.updateViewOrder(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
  }
}
