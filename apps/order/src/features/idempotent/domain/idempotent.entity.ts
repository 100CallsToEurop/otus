import { Entity, PrimaryColumn } from 'typeorm';
import { IIdempotent } from './idempotent.interface';
import { Logger } from '@nestjs/common';
import { validateSync } from 'class-validator';

@Entity('idempotent_keys')
export class IdempotentEntity implements IIdempotent {
  private logger = new Logger(IdempotentEntity.name);
  @PrimaryColumn('uuid')
  id: string;

  static create(id: string): IdempotentEntity {
    const idempotent = new IdempotentEntity();
    idempotent.id = id;
    const error = validateSync(idempotent);
    if (!!error.length) {
      error.forEach((e) => idempotent.logger.error(e.constraints));
      throw new Error('Idempotent key not valid');
    }
    return idempotent;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
