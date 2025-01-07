import { IProduct } from '../../domain/product/product.interface';

export abstract class ProductRepository {
  abstract save(product: IProduct): Promise<IProduct>;
  abstract saveMany(products: IProduct[]): Promise<void>;
  abstract getByName(name: string): Promise<IProduct | null>;
  abstract getAll(productIds?: number[]): Promise<IProduct[]>;
  abstract getAllByOrderId(orderId: number): Promise<IProduct[]>;
  abstract deleteReservedProduct(ids: number[]): Promise<void>;
}
