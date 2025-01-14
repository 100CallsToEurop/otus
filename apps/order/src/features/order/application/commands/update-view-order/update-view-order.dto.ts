import { STATUS_ORDER } from '@app/consts';

export type UpdateViewOrderDto = {
  orderId: number;
  transactionId: string;
  status?: STATUS_ORDER;
  items?: Record<string, any>[];
  courierFullName?: string;
  transactionMessage?: string;
};
