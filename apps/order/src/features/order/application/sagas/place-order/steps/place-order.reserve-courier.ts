import { ReserveCourierContract } from '@app/amqp-contracts/queues/order';
import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';

export class PlaceOrderSagaReserveCourier extends PlaceOrderSagaState {
  public started(): Promise<IOrder> {
    throw new Error('Невозможно начать покупку товаров в процессе');
  }
  public async reserveProducts(): Promise<IOrder> {
    throw new Error('Резервирование товаров невозможно');
  }
  public async paymentOrder(): Promise<IOrder> {
    throw new Error('Оплата невозможна');
  }
  public async reserveCourier(): Promise<IOrder> {
    await this.saga.amqpConnection.publish(
      ReserveCourierContract.queue.exchange.name,
      ReserveCourierContract.queue.routingKey,
      {
        orderId: this.saga.order.orderId,
        transactionId: this.saga.order.transactionId,
        deliveryDate: this.saga.order.deliveryDate,
      },
    );
    return this.saga.order;
  }

  public async finished(): Promise<IOrder> {
    throw new Error('Невозможно закончить покупку товаров в процессе');
  }

  public async canceled(): Promise<IOrder> {
    throw new Error('Невозможно отменить заказ, в процессе');
  }
}
