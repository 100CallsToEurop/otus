import { STATUS_ORDER } from '@app/consts';
import { IOrderView } from './order.view.interface';

export class OrderViewResponse {
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

  constructor(order: IOrderView) {
    this.id = order.id;
    this.userId = order.userId;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
    this.items = order.items;
    this.created = order.createdAt.toISOString();
    this.updated = order.updatedAt.toISOString();
    this.deliveryDate = order.deliveryDate.toISOString();
    this.courierFullName = order.courierFullName;
    this.transactionMessage =
      order.status === STATUS_ORDER.COMPLETED
        ? 'Заказ оформлен успешно!'
        : order.transactionMessage;
  }
}
