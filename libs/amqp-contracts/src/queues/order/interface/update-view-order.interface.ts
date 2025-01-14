import { STATUS_ORDER } from '@app/consts';

export interface IUpdateViewOrder {
  orderId: number;
  transactionId: string;
  status?: STATUS_ORDER;
  courierFullName?: string;
  transactionMessage?: string;
  items?: Record<string, any>[];
}
