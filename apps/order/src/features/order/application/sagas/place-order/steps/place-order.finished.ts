import { PlaceOrderSagaState } from '../place-order.state';
import { IOrder } from '../../../../domain';
import { STATUS_ORDER } from '@app/consts';

export class PlaceOrderSagaFinished extends PlaceOrderSagaState {
  public async started(): Promise<IOrder> {
    throw new Error('Невозможно начать покупку товаров в процессе');
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
    this.saga.order.status = STATUS_ORDER.COMPLETED;
    return this.saga.order;
  }

  public async canceled(): Promise<IOrder> {
    throw new Error('Невозможно отменить заказ, который был обработан');
  }
}
