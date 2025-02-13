import { Controller } from '@nestjs/common';
import { CourierFacade } from '../application';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { ReserveCourierContract } from '@app/amqp-contracts/queues/order';
import { Public } from '@app/common/decorators';
import { IdempotencyService } from '@app/idempotency';

@Public()
@Controller()
export class CourierEventController {
  constructor(
    private readonly idempotencyService: IdempotencyService,
    private readonly courierFacade: CourierFacade,
  ) {}

  @RabbitSubscribe({
    exchange: ReserveCourierContract.queue.exchange.name,
    routingKey: ReserveCourierContract.queue.routingKey,
    queue: ReserveCourierContract.queue.queue,
  })
  async reserveCourier(request: ReserveCourierContract.request): Promise<void> {
    try {
      const idempotency = await this.idempotencyService.checkIdempotency(
        request.eventId,
      );
      if (!idempotency) {
        await this.courierFacade.commands.reserve(request.payload);
      }
    } catch (error) {
      console.error(error);
    }
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
