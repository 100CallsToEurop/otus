import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IIdempotency } from './idempotency.interface';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';

@Entity('idempotency')
export class IdempotencyEntity implements IIdempotency {
  private logger = new Logger(IdempotencyEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsString()
  @IsOptional()
  @Column({ name: 'event_type' })
  eventId: string;
  static create(idempotency: Partial<IIdempotency>): IIdempotency {
    const _idempotency = new IdempotencyEntity();
    idempotency?.id && (_idempotency.id = idempotency.id);
    _idempotency.eventId = idempotency.eventId;
    const error = validateSync(_idempotency);
    if (!!error.length) {
      error.forEach((e) => _idempotency.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _idempotency;
  }
  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
