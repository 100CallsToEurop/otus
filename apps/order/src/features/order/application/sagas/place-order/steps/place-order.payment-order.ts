import { DeductFundsContract } from '@app/amqp-contracts/queues/order';
import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';

export class PlaceOrderSagaPaymentOrder extends PlaceOrderSagaState {
  public started(): Promise<IOrder> {
    throw new Error('Невозможно начать покупку товаров в процессе');
  }
  public async reserveProducts(): Promise<IOrder> {
    throw new Error('Резервирование товаров невозможно');
  }
  public async paymentOrder(): Promise<IOrder> {
    await this.saga.amqpConnection.publish(
      DeductFundsContract.queue.exchange.name,
      DeductFundsContract.queue.routingKey,
      {
        userId: this.saga.order.userId,
        orderId: this.saga.order.orderId,
        transactionId: this.saga.order.transactionId,
        amount: this.saga.order.totalPrice,
      },
    );
    return this.saga.order;
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
