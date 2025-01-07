import { IOrder } from '../../../domain';
import { PlaceOrderSaga } from './place-order.saga';

export abstract class PlaceOrderSagaState {
  public saga: PlaceOrderSaga;

  public setContext(saga: PlaceOrderSaga) {
    this.saga = saga;
  }

  public abstract started(): Promise<IOrder>;

  public abstract reserveProducts(): Promise<IOrder>;

  public abstract paymentOrder(): Promise<IOrder>;

  public abstract reserveCourier(): Promise<IOrder>;

  public abstract finished(): Promise<IOrder>;

  public abstract canceled(): Promise<IOrder>;
}
