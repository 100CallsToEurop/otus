import { IProduct } from './product.interface';

export class ProductResponse {
  id: number;
  name: string;
  price: number;
  quantity: number;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.quantity = product.quantity;
  }
}
