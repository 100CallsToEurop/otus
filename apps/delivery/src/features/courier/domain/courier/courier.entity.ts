import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import {
  AvailabilitySlotEntity,
  IAvailabilitySlot,
} from '../availability-slot';
import { ICourier } from './courier.interface';
import { IsOptional, IsNumber, IsString, validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';

@Entity('couriers')
export class CourierEntity implements ICourier {
  private logger = new Logger(CourierEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsString()
  @Column({ name: 'full_name' })
  fullName: string;

  @OneToMany(() => AvailabilitySlotEntity, (slot) => slot.courier, {
    cascade: true,
  })
  @IsOptional()
  availabilitySlots: IAvailabilitySlot[];

  static create(courier: Partial<ICourier>): ICourier {
    const _courier = new CourierEntity();
    courier?.id && (_courier.id = courier.id);
    _courier.fullName = courier.fullName;
    _courier.availabilitySlots = [];
    const error = validateSync(_courier);
    if (!!error.length) {
      error.forEach((e) => _courier.logger.error(e.constraints));
      throw new Error('Create courier not valid');
    }
    return _courier;
  }

  addSlot(orderId: number, transactionId: string, date: Date): void {
    const _slot = AvailabilitySlotEntity.create({
      orderId,
      transactionId,
      date,
    });
    this.availabilitySlots.push(_slot);
  }

  deleteSlot(orderId: number, transactionId: string): void {
    this.availabilitySlots = this.availabilitySlots.filter(
      (slot) => slot.transactionId !== transactionId,
    );
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
