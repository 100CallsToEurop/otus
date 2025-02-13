import { STATUS_ORDER } from '@app/consts';

export interface IPlaceOrder {
  eventId: string;
  payload: {
    orderId: number;
    transactionId: string;
    status: STATUS_ORDER;
    completed: boolean;
  };
}
