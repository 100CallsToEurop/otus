import { STATUS_ORDER } from '../../../const';
import { ProductResponse } from '../../product/domain';
import { IOrder } from './order.interface';

export class OrderResponse {
  id: number;
  userId: number;
  status: STATUS_ORDER;
  totalPrice: number;
  items: ProductResponse[];
  created: string;
  updated: string;

  constructor(order: IOrder) {
    this.id = order.id;
    this.userId = order.userId;
    this.status = order.status;
    this.totalPrice = order.totalPrice;
    this.items = order.products.map((product) => new ProductResponse(product));
    this.created = order.createdAt.toISOString();
    this.updated = order.updatedAt.toISOString();
  }
}
