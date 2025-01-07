import { IOrder } from '../order.interface';

export class SaveViewOrderEvent {
  constructor(public order: IOrder) {}
}
