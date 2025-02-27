import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';

export class PlaceOrderSagaPaymentOrder extends PlaceOrderSagaState {
  public started(): Promise<IOrder> {
    throw new Error('Невозможно начать покупку товаров в процессе');
  }
  public async reserveProducts(): Promise<IOrder> {
    throw new Error('Резервирование товаров невозможно');
  }
  public async paymentOrder(eventId: string): Promise<IOrder> {
    await this.saga.orderRepository.deductFunds(eventId, this.saga.order);
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
