import { IProduct } from '../../domain/product.interface';

export abstract class ProductRepository {
  abstract save(product: IProduct): Promise<IProduct>;
  abstract getByName(name: string): Promise<IProduct | null>;
  abstract getAll(productIds?: number[]): Promise<IProduct[]>;
}
