import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './place-order.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { PlaceOrderSaga } from '../../sagas/place-order';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import { CancelPaymentConfirmationContract } from '@app/amqp-contracts/queues/billing';
import { CancelProductReservedContract } from '@app/amqp-contracts/queues/warehouse';
import { UpdateViewOrderStatusEvent } from '../../../domain/events';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler
  implements ICommandHandler<PlaceOrderCommand, void>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly orderRepository: OrderRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private async reserveProductFailed(orderId: number) {
    await this.amqpConnection.publish(
      CancelPaymentConfirmationContract.queue.exchange.name,
      CancelPaymentConfirmationContract.queue.routingKey,
      {
        orderId,
      },
    );
  }

  private async reserveCourierFailed(orderId: number) {
    await this.reserveProductFailed(orderId);
    await this.amqpConnection.publish(
      CancelProductReservedContract.queue.exchange.name,
      CancelProductReservedContract.queue.routingKey,
      {
        orderId,
      },
    );
  }

  private async saveViewOrder(orderId: number, status: STATUS_ORDER) {
    await this.eventBus.publish(
      new UpdateViewOrderStatusEvent(orderId, status),
    );
  }

  async execute({
    placeOrderDto: { orderId, status, completed },
  }: PlaceOrderCommand): Promise<void> {
    const order = await this.orderRepository.getById(orderId);

    if (!completed) {
      order.setStatus(STATUS_ORDER.CANCELED);
      await this.orderRepository.save(order);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS)
        await this.reserveProductFailed(orderId);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_COURIER)
        await this.reserveCourierFailed(orderId);
      return;
    }

    const saga = new PlaceOrderSaga(order, this.amqpConnection);
    let orderSaga;

    switch (status) {
      case STATUS_ORDER.WAITING_FOR_PAYMENT:
        saga.setState(STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS);
        orderSaga = await saga.getState().reserveProducts();
        break;
      case STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS:
        saga.setState(STATUS_ORDER.WAITING_FOR_RESERVE_COURIER);
        orderSaga = await saga.getState().reserveCourier();
        break;
      case STATUS_ORDER.WAITING_FOR_RESERVE_COURIER:
        saga.setState(STATUS_ORDER.COMPLETED);
        orderSaga = await saga.getState().finished();
        await this.saveViewOrder(orderId, STATUS_ORDER.COMPLETED);
        break;
    }
    await this.orderRepository.save(orderSaga);
  }
}
