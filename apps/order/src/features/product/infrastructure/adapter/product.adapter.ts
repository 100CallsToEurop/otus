import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository';
import { IProduct } from '../../domain/product.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../domain/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductAdapter implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}
  async save(product: IProduct): Promise<IProduct> {
    return await this.productRepository.save(product);
  }

  async getByName(name: string): Promise<IProduct | null> {
    return await this.productRepository.findOneBy({ name });
  }

  async getAll(): Promise<IProduct[]> {
    return await this.productRepository.find();
  }
}
