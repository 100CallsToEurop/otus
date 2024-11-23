import { IBadToken } from './bad.token.interface';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('bad_tokens')
export class BadTokenEntity extends AggregateRoot implements IBadToken {
  private readonly logger = new Logger(BadTokenEntity.name);
  @IsOptional()
  @PrimaryGeneratedColumn('increment')
  @IsNumber()
  id: number;

  @Column({ name: 'token' })
  @IsString()
  @IsNotEmpty()
  token: string;

  private constructor() {
    super();
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }

  static create(badToken: Partial<IBadToken>): IBadToken {
    const _badToken = new BadTokenEntity();
    _badToken.token = badToken.token;

    const error = validateSync(_badToken);
    if (!!error.length) {
      error.forEach((e) => _badToken.logger.error(e.constraints));
      throw new Error('Bad token not valid');
    }
    return _badToken;
  }
}
