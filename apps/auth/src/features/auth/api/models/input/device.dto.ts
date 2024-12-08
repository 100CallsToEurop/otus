import { Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class DeviceDto {
  @Type(() => Number)
  @IsNumber()
  userId: number;

  @Type(() => String)
  @IsString()
  deviceId?: string;

  @Type(() => String)
  @IsString()
  ip: string;

  @Type(() => String)
  @IsString()
  user_agent: string;
}
