import { STATUS_ORDER } from '@app/consts';

export class OrderViewModel {
  orderId: number;
  userId: number;
  transactionId: string;
  status: STATUS_ORDER;
  totalPrice: number;
  items: Record<string, any>[];
  created: string;
  updated: string;
  deliveryDate: string;
  courierFullName: string;
  transactionMessage: string;
}
