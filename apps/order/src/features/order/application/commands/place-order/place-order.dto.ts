import { STATUS_ORDER } from '@app/consts';

export type PlaceOrderDto = {
  orderId: number;
  transactionId: string;
  status: STATUS_ORDER;
  completed: boolean;
};
