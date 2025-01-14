import { IReservedProduct } from '../reserved-product';

export interface IProduct {
  id: number;
  name: string;
  price: number;
  quantity: number;
  reservedProducts: IReservedProduct[];

  addReservedProduct(orderId: number, transactionId: string): boolean;
  plainToInstance(): void;
}
