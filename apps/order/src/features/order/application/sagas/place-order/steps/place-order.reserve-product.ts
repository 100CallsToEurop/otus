import { ReserveProductContract } from '@app/amqp-contracts/queues/order';
import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';

export class PlaceOrderSagaReserveProduct extends PlaceOrderSagaState {
  public started(): Promise<IOrder> {
    throw new Error('Невозможно начать покупку товаров в процессе');
  }
  public async reserveProducts(): Promise<IOrder> {
    await this.saga.amqpConnection.publish(
      ReserveProductContract.queue.exchange.name,
      ReserveProductContract.queue.routingKey,
      {
        orderId: this.saga.order.id,
        itemsIds: this.saga.order.items,
      },
    );
    return this.saga.order;
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
    throw new Error('Невозможно отменить заказ, в процессе');
  }
}
