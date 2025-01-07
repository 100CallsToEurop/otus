import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsOptional, IsNumber, Min, validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';
import { IReservedProduct } from './reserved-product.interface';
import { IProduct, ProductEntity } from '../product';

@Entity('reserved-products')
export class ReservedProductEntity implements IReservedProduct {
  private logger = new Logger(ReservedProductEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsNumber()
  @Column()
  orderId: number;
  @IsNumber()
  @Min(0)
  @Column()
  quantity: number;
  @IsNumber()
  @Min(0)
  @Column({ name: 'price', type: 'int' })
  price: number;

  @ManyToOne(() => ProductEntity, (product) => product.reservedProducts, {
    onDelete: 'CASCADE',
  })
  product: IProduct;

  static create(product: Partial<IReservedProduct>): IReservedProduct {
    const _product = new ReservedProductEntity();
    product?.id && (_product.id = product.id);
    _product.orderId = product.orderId;
    _product.quantity = product.quantity;
    _product.price = product.price;
    const error = validateSync(_product);
    if (!!error.length) {
      error.forEach((e) => _product.logger.error(e.constraints));
      throw new Error('Create reserved product not valid');
    }
    return _product;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
