import { Controller } from '@nestjs/common';
import { OrderFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { Public } from '@app/common/decorators';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';

@Public()
@Controller()
export class OrderEventController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @RabbitSubscribe({
    exchange: PlaceOrderContract.queue.exchange.name,
    routingKey: PlaceOrderContract.queue.routingKey,
    queue: PlaceOrderContract.queue.queue,
  })
  async placeOrder(payload: PlaceOrderContract.request) {
    await this.orderFacade.commands.placeOrder(payload);
  }

  @RabbitSubscribe({
    exchange: UpdateViewOrderContract.queue.exchange.name,
    routingKey: UpdateViewOrderContract.queue.routingKey,
    queue: UpdateViewOrderContract.queue.queue,
  })
  async updateViewOrder(payload: UpdateViewOrderContract.request) {
    await this.orderFacade.commands.updateViewOrder(payload);
  }
}
