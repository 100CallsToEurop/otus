import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { IProfile, ProfileEntity } from '../profile';
import { IUser } from './user.interface';

@Entity('users')
export class UserEntity implements IUser {
  private logger = new Logger(UserEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @Column({ name: 'user_name' })
  username: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  @Column({ name: 'email' })
  email: string;
  @Column({ name: 'password_hash' })
  @IsString()
  passwordHash: string;
  @IsOptional()
  @OneToOne(() => ProfileEntity, (profile) => profile.user, { cascade: true })
  @JoinColumn()
  profile: IProfile;

  static create(user: Partial<IUser>): IUser {
    const _user = new UserEntity();
    user?.id && (_user.id = user.id);
    _user.username = user.username;
    _user.email = user.email;
    _user.passwordHash = user.passwordHash;
    _user.profile = ProfileEntity.create(user);
    const error = validateSync(_user);
    if (!!error.length) {
      error.forEach((e) => _user.logger.error(e.constraints));
      throw new Error('Create user not valid');
    }
    return _user;
  }
  update(update: Partial<IUser & IProfile>): void {
    this.email = update.email ?? this.email;
    this.profile.update(update);
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
