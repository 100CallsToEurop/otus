import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IOutbox } from './outbox.interface';
import {
  IsOptional,
  IsNumber,
  IsUUID,
  IsString,
  IsDate,
  validateSync,
  IsEnum,
  IsObject,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { OUTBOX_STATUS } from '@app/consts';
import { randomUUID } from 'crypto';

@Entity('outbox')
export class OutboxEntity implements IOutbox {
  private logger = new Logger(OutboxEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsUUID()
  @IsOptional()
  @Column()
  eventId: string;
  @IsString()
  @IsOptional()
  @Column({ name: 'event_type' })
  eventType: string;
  @IsObject()
  @IsOptional()
  @Column({ type: 'jsonb' })
  payload: Record<string, any>;
  @IsEnum(OUTBOX_STATUS)
  @IsOptional()
  @Column({ type: 'enum', enum: OUTBOX_STATUS })
  status: OUTBOX_STATUS;
  @IsDate()
  @IsOptional()
  @CreateDateColumn()
  createdAt: Date;
  @Column({ name: 'routing_key' })
  routingKey: string;

  static create(outbox: Partial<IOutbox>): IOutbox {
    const _outbox = new OutboxEntity();
    outbox?.id && (_outbox.id = outbox.id);
    _outbox.eventId = outbox.eventId ?? randomUUID();
    _outbox.eventType = outbox.eventType;
    _outbox.status = outbox.status ?? OUTBOX_STATUS.WAITING;
    _outbox.payload = outbox.payload;
    _outbox.createdAt = outbox.createdAt;
    _outbox.routingKey = outbox.routingKey;
    const error = validateSync(_outbox);
    if (!!error.length) {
      error.forEach((e) => _outbox.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _outbox;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
