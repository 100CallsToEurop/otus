import { STATUS_ORDER } from '../../../const';
import { IProduct } from '../../product/domain';

export interface IOrder {
  id: number;
  userId: number;
  products: IProduct[];
  status: STATUS_ORDER;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;

  addProducts(products: IProduct[]): void;
  setStatus(status: STATUS_ORDER): void;
  plainToInstance(): void;
}
