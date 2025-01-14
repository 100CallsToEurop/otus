import { STATUS_ORDER } from '@app/consts';

export interface IOrder {
  id: number;
  orderId: number;
  userId: number;
  transactionId: string;
  items: number[];
  status: STATUS_ORDER;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
  deliveryDate: Date;

  addItemsIds(itemsIds: number[]): void;
  setStatus(status: STATUS_ORDER): void;
  plainToInstance(): void;
}
