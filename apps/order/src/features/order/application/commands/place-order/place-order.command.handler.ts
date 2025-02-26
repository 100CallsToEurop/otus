import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './place-order.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { PlaceOrderSaga } from '../../sagas/place-order';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { STATUS_ORDER } from '@app/consts';
import { UpdateViewOrderStatusEvent } from '../../../domain/events';
import { IOrder } from '../../../domain';
import { OrderReadyEvent } from '../../../../user/domain/events';

@CommandHandler(PlaceOrderCommand)
export class PlaceOrderCommandHandler
  implements ICommandHandler<PlaceOrderCommand, void>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly orderRepository: OrderRepository,
    private readonly amqpConnection: AmqpConnection,
  ) {}

  private async reserveProductFailed(transactionId: string, order: IOrder) {
    await this.orderRepository.cancelPaymentConfirmation(transactionId, order);
  }

  private async reserveCourierFailed(transactionId: string, order: IOrder) {
    await this.reserveProductFailed(transactionId, order);
    await this.orderRepository.cancelProductReserved(transactionId, order);
  }

  private async saveViewOrder(
    order: IOrder,
    transactionId: string,
    status: STATUS_ORDER,
  ) {
    await this.eventBus.publish(
      new UpdateViewOrderStatusEvent(order.id, transactionId, status),
    );
    await this.eventBus.publish(
      new OrderReadyEvent(order.id, order.userId, true),
    );
  }

  async execute({
    placeOrderDto: { orderId, transactionId, status, completed },
  }: PlaceOrderCommand): Promise<void> {
    const order = await this.orderRepository.getById(orderId, transactionId);
    if (!completed) {
      order.setStatus(STATUS_ORDER.CANCELED);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS)
        await this.reserveProductFailed(transactionId, order);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_COURIER)
        await this.reserveCourierFailed(transactionId, order);

      await this.eventBus.publish(
        new OrderReadyEvent(orderId, order.userId, false),
      );
      return;
    }
    const saga = new PlaceOrderSaga(
      order,
      this.amqpConnection,
      this.orderRepository,
    );
    let orderSaga: IOrder;
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
        await this.saveViewOrder(order, transactionId, STATUS_ORDER.COMPLETED);
        break;
    }
    await this.orderRepository.save(orderSaga);
  }
}
