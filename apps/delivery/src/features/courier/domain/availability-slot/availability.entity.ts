import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IAvailabilitySlot } from './availability.interface';
import {
  IsOptional,
  IsNumber,
  IsDate,
  validateSync,
  IsString,
  IsUUID,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { CourierEntity, ICourier } from '../courier';

@Entity('availability_slots')
export class AvailabilitySlotEntity implements IAvailabilitySlot {
  private logger = new Logger(AvailabilitySlotEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsNumber()
  @Column()
  orderId: number;
  @IsString()
  @IsUUID()
  @Column({ type: 'uuid', name: 'transaction_id' })
  transactionId: string;
  @IsDate()
  @Column({ name: 'date' })
  date: Date;

  @ManyToOne(() => CourierEntity, (courier) => courier.availabilitySlots, {
    onDelete: 'CASCADE',
  })
  courier: ICourier;

  static create(slot: Partial<IAvailabilitySlot>): IAvailabilitySlot {
    const _availabilitySlot = new AvailabilitySlotEntity();
    _availabilitySlot.orderId = slot.orderId;
    _availabilitySlot.transactionId = slot.transactionId;
    _availabilitySlot.date = new Date(slot.date);
    const error = validateSync(_availabilitySlot);
    if (!!error.length) {
      error.forEach((e) => _availabilitySlot.logger.error(e.constraints));
      throw new Error('Create slot not valid');
    }
    return _availabilitySlot;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
