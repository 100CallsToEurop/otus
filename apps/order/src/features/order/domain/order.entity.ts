import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IOrder } from './order.interface';
import {
  IsOptional,
  IsNumber,
  IsEnum,
  IsString,
  IsDate,
  Min,
  validateSync,
  IsArray,
  IsUUID,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { STATUS_ORDER } from '@app/consts';
import { randomUUID } from 'crypto';

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
  @IsNumber()
  @Column()
  orderId: number;
  @IsString()
  @IsUUID()
  @Column({ type: 'uuid', name: 'transaction_id' })
  transactionId: string;
  @IsEnum(STATUS_ORDER)
  @IsString()
  @Column({ type: 'enum', enum: STATUS_ORDER })
  status: STATUS_ORDER;
  @IsNumber()
  @Min(0)
  @Column({ name: 'total_price', type: 'int' })
  totalPrice: number;
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;
  @IsArray()
  @IsNumber({}, { each: true })
  @Column({ type: 'int', array: true })
  items: number[];
  @IsDate()
  @Column({ name: 'delivery_date' })
  deliveryDate: Date;

  static create(
    userId: number,
    orderId: number,
    totalPrice: number,
    deliveryTime: Date,
  ): IOrder {
    const _order = new OrderEntity();
    _order.id = orderId;
    _order.orderId = orderId;
    _order.userId = userId;
    _order.transactionId = randomUUID();
    _order.status = STATUS_ORDER.PENDING;
    _order.totalPrice = totalPrice;
    _order.createdAt = new Date();
    _order.updatedAt = new Date();
    _order.deliveryDate = deliveryTime;
    _order.items = [];

    const error = validateSync(_order);
    if (!!error.length) {
      error.forEach((e) => _order.logger.error(e.constraints));
      throw new Error('Create order not valid');
    }
    return _order;
  }

  addItemsIds(itemsIds: number[]): void {
    this.items.push(...itemsIds);
  }

  setStatus(status: STATUS_ORDER): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
