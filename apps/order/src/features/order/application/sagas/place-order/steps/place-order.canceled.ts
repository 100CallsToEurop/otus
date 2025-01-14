import { PlaceOrderContract } from '@app/amqp-contracts/queues/order';
import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';
import { STATUS_ORDER } from '@app/consts';

export class PlaceOrderSagaCanceled extends PlaceOrderSagaState {
  public async started(): Promise<IOrder> {
    await this.saga.amqpConnection.publish(
      PlaceOrderContract.queue.exchange.name,
      PlaceOrderContract.queue.routingKey,
      {
        orderId: this.saga.order.id,
        transactionId: this.saga.order.transactionId,
        status: STATUS_ORDER.PENDING,
      },
    );
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
    throw new Error('Невозможно закончить покупку товаров во время отмены');
  }

  public async canceled(): Promise<IOrder> {
    throw new Error('Невозможно отменить отмененную покупку товаров');
  }
}
