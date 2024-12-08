import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { Logger } from '@nestjs/common';
import { UserEntity } from '../user';
import { IProfile } from './profile.interface';

@Entity('profiles')
export class ProfileEntity implements IProfile {
  private logger = new Logger(ProfileEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
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
  @Column({ name: 'phone' })
  phone: string;

  @IsOptional()
  @OneToOne(() => UserEntity, (user) => user.profile, { onDelete: 'CASCADE' })
  user: UserEntity;

  static create(profile: Partial<IProfile>): IProfile {
    const _profile = new ProfileEntity();
    _profile.firstName = profile.firstName ?? '';
    _profile.lastName = profile.lastName ?? '';
    _profile.phone = profile.phone ?? '';
    const error = validateSync(_profile);
    if (!!error.length) {
      error.forEach((e) => _profile.logger.error(e.constraints));
      throw new Error('Profile not valid');
    }
    return _profile;
  }
  update(profile: Partial<IProfile>): void {
    this.firstName = profile.firstName ?? this.firstName;
    this.lastName = profile.lastName ?? this.lastName;
    this.phone = profile.phone ?? this.phone;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }
}
