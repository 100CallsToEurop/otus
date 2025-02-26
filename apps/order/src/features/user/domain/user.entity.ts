import { Column, Entity, PrimaryColumn } from 'typeorm';
import { IOrderUser } from './user.interface';
import { IsOptional, IsNumber, IsString, validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';

@Entity('order_users')
export class OrderUserEntity implements IOrderUser {
  private logger = new Logger(OrderUserEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryColumn()
  id: number;
  @IsOptional()
  @IsString()
  @Column()
  email: string;
  @IsOptional()
  @IsString()
  @Column()
  fullName: string;

  static create(user: Partial<IOrderUser>): IOrderUser {
    const _user = new OrderUserEntity();
    _user.id = user.id;
    _user.email = user.email;
    _user.fullName = user.fullName;

    const error = validateSync(_user);
    if (!!error.length) {
      error.forEach((e) => _user.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _user;
  }

  update(user: Partial<IOrderUser>): void {
    this.email = user.email ?? this.email;
    this.fullName = user.fullName ?? this.fullName;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
