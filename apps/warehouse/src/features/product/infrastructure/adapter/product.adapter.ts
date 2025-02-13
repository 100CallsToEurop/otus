import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../repository';
import { IProduct } from '../../domain/product/product.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from '../../domain/product/product.entity';
import { DataSource, In, Repository } from 'typeorm';
import { ReservedProductEntity } from '../../domain/reserved-product';
import { OutboxEntity } from '@app/outbox/domain';
import {
  PlaceOrderContract,
  UpdateViewOrderContract,
} from '@app/amqp-contracts/queues/order';
import { STATUS_ORDER } from '@app/consts';
import { ProductResponse } from '../../domain/product';

@Injectable()
export class ProductAdapter implements ProductRepository {
  constructor(
    private readonly dataSource: DataSource,
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

  async reserveProducts(
    orderId: number,
    transactionId: string,
    products: IProduct[],
  ): Promise<void> {
    const outboxPayload = {
      routingKey: PlaceOrderContract.queue.routingKey,
      eventType: 'product.reserved',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS,
        completed: true,
      },
    };
    const updatePayload = {
      routingKey: UpdateViewOrderContract.queue.routingKey,
      eventType: 'update.view.product',
      payload: {
        orderId,
        transactionId,
        status: STATUS_ORDER.WAITING_FOR_RESERVE_PRODUCTS,
        items: products.map((item) => new ProductResponse(item)),
        transactionMessage: '',
      },
    };
    await this.saveTransaction(outboxPayload, products);
    await this.saveTransaction(updatePayload, products);
  }

  private async saveTransaction(
    outboxPayload: {
      routingKey: string;
      eventType: string;
      payload: any;
    },
    products: IProduct[],
  ): Promise<void> {
    const outbox = OutboxEntity.create(outboxPayload);

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(OutboxEntity).save(outbox);
      await manager.getRepository(ProductEntity).save(products);
    });
  }
}
