import { IOrder } from '../../../domain';
import { PlaceOrderSaga } from './place-order.saga';

export abstract class PlaceOrderSagaState {
  public saga: PlaceOrderSaga;

  public setContext(saga: PlaceOrderSaga) {
    this.saga = saga;
  }

  public abstract started(eventId: string): Promise<IOrder>;

  public abstract reserveProducts(eventId: string): Promise<IOrder>;

  public abstract paymentOrder(eventId: string): Promise<IOrder>;

  public abstract reserveCourier(eventId: string): Promise<IOrder>;

  public abstract finished(): Promise<IOrder>;

  public abstract canceled(): Promise<IOrder>;
}
