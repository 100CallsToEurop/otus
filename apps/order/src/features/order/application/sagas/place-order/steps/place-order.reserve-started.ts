import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';
import { STATUS_ORDER } from '@app/consts';

export class PlaceOrderSagaStarted extends PlaceOrderSagaState {
  public async started(): Promise<IOrder> {
    this.saga.setState(STATUS_ORDER.WAITING_FOR_PAYMENT);
    await this.saga.getState().paymentOrder();
    return this.saga.order;
  }

  public async reserveProducts(): Promise<IOrder> {
    throw new Error('Резервирование товаров невозможно');
  }
  public async paymentOrder(): Promise<IOrder> {
    throw new Error('Оплата невозможна');
  }
  public async reserveCourier(): Promise<IOrder> {
    throw new Error('Резервирование курьера невозможно');
  }

  public async finished(): Promise<IOrder> {
    throw new Error('Невозможно закончить покупку товаров в процессе');
  }

  public async canceled(): Promise<IOrder> {
    // await this.saga.amqpConnection.publish(
    //   CancelPlaceOrderContract.queue.exchange.name,
    //   CancelPlaceOrderContract.queue.routingKey,
    //   {
    //     orderId: this.saga.order.id,
    //   },
    // );
    this.saga.order.status = STATUS_ORDER.CANCELED;
    return this.saga.order;
  }
}
