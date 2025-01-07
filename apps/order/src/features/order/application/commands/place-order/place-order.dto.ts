import { STATUS_ORDER } from '@app/consts';

export type PlaceOrderDto = {
  orderId: number;
  status: STATUS_ORDER;
  completed: boolean;
};
