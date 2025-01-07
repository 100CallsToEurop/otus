import { STATUS_ORDER } from '@app/consts';

export interface IPlaceOrder {
  orderId: number;
  status: STATUS_ORDER;
  completed: boolean;
}
