import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository';
import { IProduct } from '../../domain/product/product.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../domain/product/product.entity';
import { In, Repository } from 'typeorm';
import { ReservedProductEntity } from '../../domain/reserved-product';

@Injectable()
export class ProductAdapter implements ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(ReservedProductEntity)
    private readonly reservedProductRepository: Repository<ReservedProductEntity>,
  ) {}
  async save(product: IProduct): Promise<IProduct> {
    return await this.productRepository.save(product);
  }

  async saveMany(products: IProduct[]): Promise<void> {
    await this.productRepository.save(products);
  }

  async getByName(name: string): Promise<IProduct | null> {
    return await this.productRepository.findOneBy({ name });
  }

  async getAll(productIds?: number[]): Promise<IProduct[]> {
    const condition = productIds
      ? { where: { id: In(productIds) }, relations: { reservedProducts: true } }
      : {};
    return await this.productRepository.find(condition);
  }

  async getAllByOrderId(
    orderId: number,
    transactionId: string,
  ): Promise<IProduct[]> {
    return await this.productRepository.find({
      where: {
        reservedProducts: {
          orderId,
          transactionId,
        },
      },
      relations: { reservedProducts: true },
    });
  }

  async deleteReservedProduct(ids: number[]): Promise<void> {
    await this.reservedProductRepository.delete({ id: In(ids) });
  }
}
