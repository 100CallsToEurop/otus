import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductsQuery } from './get-products.query';
import { ProductResponse } from '../../../domain/product';
import { ProductRepository } from '../../../infrastructure/repository';

@QueryHandler(GetProductsQuery)
export class GetProductsQueryHandler
  implements IQueryHandler<GetProductsQuery, ProductResponse[]>
{
  constructor(private readonly productRepository: ProductRepository) {}
  async execute(): Promise<ProductResponse[]> {
    const products = await this.productRepository.getAll();
    if (!products.length) return [];
    return products.map((product) => new ProductResponse(product));
  }
}
