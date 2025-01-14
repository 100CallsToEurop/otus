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

  private async reserveProductFailed(orderId: number, transactionId: string) {
    await this.amqpConnection.publish(
      CancelPaymentConfirmationContract.queue.exchange.name,
      CancelPaymentConfirmationContract.queue.routingKey,
      {
        orderId,
        transactionId,
      },
    );
  }

  private async reserveCourierFailed(orderId: number, transactionId: string) {
    await this.reserveProductFailed(orderId, transactionId);
    await this.amqpConnection.publish(
      CancelProductReservedContract.queue.exchange.name,
      CancelProductReservedContract.queue.routingKey,
      {
        orderId,
        transactionId,
      },
    );
  }

  private async saveViewOrder(
    orderId: number,
    transactionId: string,
    status: STATUS_ORDER,
  ) {
    await this.eventBus.publish(
      new UpdateViewOrderStatusEvent(orderId, transactionId, status),
    );
  }

  async execute({
    placeOrderDto: { orderId, transactionId, status, completed },
  }: PlaceOrderCommand): Promise<void> {
    const order = await this.orderRepository.getById(orderId, transactionId);

    if (!completed) {
      order.setStatus(STATUS_ORDER.CANCELED);
      await this.orderRepository.save(order);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS)
        await this.reserveProductFailed(orderId, transactionId);
      if (status === STATUS_ORDER.WAITING_FOR_RESERVE_COURIER)
        await this.reserveCourierFailed(orderId, transactionId);
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
        await this.saveViewOrder(
          orderId,
          transactionId,
          STATUS_ORDER.COMPLETED,
        );
        break;
    }
    await this.orderRepository.save(orderSaga);
  }
}
