import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IProduct } from './product.interface';
import {
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { IOrder, OrderEntity } from '../../order/domain';

@Entity('products')
export class ProductEntity implements IProduct {
  private logger = new Logger(ProductEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsString()
  @MaxLength(256)
  @Column({ name: 'product_name' })
  name: string;
  @IsNumber()
  @Min(0)
  @Column({ name: 'price', type: 'int' })
  price: number;
  @ManyToMany(() => OrderEntity, (order) => order.products)
  @JoinTable()
  orders: IOrder[];

  static create(product: Partial<IProduct>): IProduct {
    const _product = new ProductEntity();
    _product.name = product.name;
    _product.price = product.price;
    const error = validateSync(_product);
    if (!!error.length) {
      error.forEach((e) => _product.logger.error(e.constraints));
      throw new Error('Create product not valid');
    }
    return _product;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
