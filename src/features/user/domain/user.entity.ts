import { IUser } from './user.interface';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  validateSync,
} from 'class-validator';
import { AggregateRoot } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';

@Entity('users')
export class UserEntity extends AggregateRoot implements IUser {
  private logger = new Logger(UserEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsString()
  @MaxLength(256)
  @Column({ name: 'user_name' })
  username: string;
  @IsOptional()
  @IsString()
  @Column({ name: 'first_name' })
  firstName: string;
  @IsOptional()
  @IsString()
  @Column({ name: 'last_name' })
  lastName: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  @Column({ name: 'email' })
  email: string;
  @IsOptional()
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'phone must be a valid phone number',
  })
  @IsString()
  @Column({ name: 'phone' })
  phone: string;

  private constructor() {
    super();
  }

  static create(user: Partial<IUser>): IUser {
    const _user = new UserEntity();
    user?.id && (_user.id = user.id);
    _user.username = user.username;
    _user.firstName = user.firstName;
    _user.lastName = user.lastName;
    _user.email = user.email;
    _user.phone = user.phone;
    const error = validateSync(_user);
    if (!!error.length) {
      error.forEach((e) => _user.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _user;
  }
  update(user: Partial<IUser>): void {
    this.firstName = user.firstName ?? this.firstName;
    this.lastName = user.lastName ?? this.lastName;
    this.email = user.email ?? this.email;
    this.phone = user.phone ?? this.phone;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
