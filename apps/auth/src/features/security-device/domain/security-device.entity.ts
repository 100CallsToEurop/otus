import { ISecurityDevice } from './security-device.interface';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  validateSync,
} from 'class-validator';
import { Logger } from '@nestjs/common';
import { AggregateRoot } from '@nestjs/cqrs';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('security_devices')
export class SecurityDeviceEntity
  extends AggregateRoot
  implements ISecurityDevice
{
  private readonly logger = new Logger(SecurityDeviceEntity.name);
  @IsOptional()
  @IsNumber()
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  @IsString()
  @IsNotEmpty()
  iat: string;
  @Column()
  @IsString()
  @IsNotEmpty()
  exp: string;
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  @Column()
  deviceId: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  ip: string;
  @IsString()
  @IsNotEmpty()
  @Column()
  user_agent: string;
  @IsNumber()
  @IsNotEmpty()
  @Column()
  userId: number;

  private constructor() {
    super();
  }

  update(event: Partial<ISecurityDevice>): void {
    this.iat = event.iat ?? this.iat;
    this.exp = event.exp ?? this.exp;
    this.ip = event.ip ?? this.ip;
    this.user_agent = event.user_agent ?? this.user_agent;
  }

  plainToInstance(): void {
    validateSync(this, { whitelist: true });
  }

  static create(device: Partial<ISecurityDevice>): ISecurityDevice {
    const _device = new SecurityDeviceEntity();
    _device.iat = device.iat.toString();
    _device.exp = device.exp.toString();
    _device.deviceId = device.deviceId;
    _device.ip = device.ip;
    _device.user_agent = device.user_agent;
    _device.userId = device.userId;
    const error = validateSync(_device);
    if (!!error.length) {
      error.forEach((e) => _device.logger.error(e.constraints));
      throw new Error('Device not valid');
    }
    return _device;
  }
}
