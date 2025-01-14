import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
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
import { IOrderView } from './order.view.interface';
import { IOrder } from '../order.interface';

@Entity('order_views')
export class OrderViewEntity implements IOrderView {
  private logger = new Logger(OrderViewEntity.name);
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
  @Column({ type: 'jsonb', nullable: true })
  items: Record<string, any>[];
  @IsDate()
  @Column({ name: 'delivery_date', nullable: true })
  deliveryDate: Date;
  @IsString()
  @Column({ name: 'courier_full_name' })
  courierFullName: string;
  @IsString()
  @Column({ name: 'transaction_message' })
  transactionMessage: string;

  static create(order: Partial<IOrder>): IOrderView {
    const _order = new OrderViewEntity();
    _order.id = order.id;
    _order.orderId = order.orderId;
    _order.userId = order.userId;
    _order.transactionId = order.transactionId;
    _order.status = STATUS_ORDER.PENDING;
    _order.totalPrice = order.totalPrice;
    _order.createdAt = new Date();
    _order.updatedAt = new Date();
    _order.deliveryDate = order.deliveryDate;
    _order.items = [];
    _order.deliveryDate = order.deliveryDate;
    _order.courierFullName = '';
    _order.transactionMessage = '';

    const error = validateSync(_order);
    if (!!error.length) {
      error.forEach((e) => _order.logger.error(e.constraints));
      throw new Error('Create view order not valid');
    }
    return _order;
  }

  update(order: Partial<IOrderView>): void {
    this.status = order.status ?? this.status;
    this.updatedAt = new Date();
    this.items = order.items ?? this.items;
    this.courierFullName = order.courierFullName ?? this.courierFullName;
    this.transactionMessage =
      order.transactionMessage ?? this.transactionMessage;
  }
  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
