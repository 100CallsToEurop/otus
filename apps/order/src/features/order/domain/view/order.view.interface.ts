import { STATUS_ORDER } from '@app/consts';

export interface IOrderView {
  id: number;
  userId: number;
  orderId: number;
  transactionId: string;
  items: Record<string, any>[];
  status: STATUS_ORDER;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate: Date;
  courierFullName: string;
  transactionMessage: string;

  update(order: Partial<IOrderView>): void;
  plainToInstance(): void;
}
