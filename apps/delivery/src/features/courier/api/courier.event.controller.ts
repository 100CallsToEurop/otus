import { Controller } from '@nestjs/common';
import { CourierFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ReserveCourierContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';

@Public()
@Controller()
export class CourierEventController {
  constructor(private readonly courierFacade: CourierFacade) {}

  @RabbitSubscribe({
    exchange: ReserveCourierContract.queue.exchange.name,
    routingKey: ReserveCourierContract.queue.routingKey,
    queue: ReserveCourierContract.queue.queue,
  })
  async reserveCourier(payload: ReserveCourierContract.request): Promise<void> {
    await this.courierFacade.commands.reserve(payload);
  }

  // @RabbitSubscribe({
  //   exchange: CancelPlaceOrderContract.queue.exchange.name,
  //   routingKey: CancelPlaceOrderContract.queue.routingKey,
  //   queue: CancelPlaceOrderContract.queue.queue,
  // })
  // async cancelReserveCourier(
  //   payload: CancelPlaceOrderContract.request,
  // ): Promise<void> {
  //   await this.courierFacade.commands.cancelReserve(payload);
  // }
}
