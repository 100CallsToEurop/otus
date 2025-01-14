import { STATUS_ORDER } from '@app/consts';
import { IOrderView } from './order.view.interface';

export class OrderViewResponse {
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

  constructor(order: IOrderView) {
    this.orderId = order.orderId;
    this.userId = order.userId;
    this.transactionId = order.transactionId;
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
