import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IProduct, ProductEntity } from '../../product/domain';
import { IOrder } from './order.interface';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  IsDate,
  Min,
  validateSync,
} from 'class-validator';
import { STATUS_ORDER } from '../../../const';
import { Logger } from '@nestjs/common';
import { randomInt } from 'crypto';

@Entity('orders')
export class OrderEntity implements IOrder {
  private logger = new Logger(OrderEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryColumn()
  id: number;
  @IsNumber()
  @Column()
  userId: number;
  @IsEnum(STATUS_ORDER)
  @IsString()
  @Column({ type: 'enum', enum: STATUS_ORDER })
  status: STATUS_ORDER;
  @IsNumber()
  @Min(0)
  @Column({ name: 'price', type: 'int' })
  totalPrice: number;
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @IsOptional()
  @OneToMany(() => ProductEntity, (product) => product.order, { cascade: true })
  products: IProduct[];

  static create(userId: number): IOrder {
    const _order = new OrderEntity();
    _order.id = randomInt(7);
    _order.userId = userId;
    _order.status = STATUS_ORDER.PENDING;
    _order.totalPrice = 0;
    _order.createdAt = new Date();
    _order.updatedAt = new Date();
    _order.products = [];
    const error = validateSync(_order);
    if (!!error.length) {
      error.forEach((e) => _order.logger.error(e.constraints));
      throw new Error('Create order not valid');
    }
    return _order;
  }

  addProducts(products: IProduct[]): void {
    this.totalPrice = products.reduce((sum, product) => sum + product.price, 0);
    this.products = products;
  }

  setStatus(status: STATUS_ORDER): void {
    this.status = status;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
