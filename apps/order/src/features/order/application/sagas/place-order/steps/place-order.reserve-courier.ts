// import { ReserveCourierContract } from '@app/amqp-contracts/queues/order';
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
  public async reserveCourier(eventId: string): Promise<IOrder> {
    await this.saga.orderRepository.reserveCourier(eventId, this.saga.order);
    return this.saga.order;
  }

  public async finished(): Promise<IOrder> {
    throw new Error('Невозможно закончить покупку товаров в процессе');
  }

  public async canceled(): Promise<IOrder> {
    throw new Error('Невозможно отменить заказ, в процессе');
  }
}
