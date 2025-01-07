import { STATUS_ORDER } from '@app/consts';

export class OrderViewModel {
  id: number;
  userId: number;
  status: STATUS_ORDER;
  totalPrice: number;
  items: Record<string, any>[];
  created: string;
  updated: string;
  deliveryDate: string;
  courierFullName: string;
  transactionMessage: string;
}
