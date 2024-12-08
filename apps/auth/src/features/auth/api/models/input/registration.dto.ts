import { Transform } from 'class-transformer';
import { MaxLength, IsString, IsOptional, IsEmail } from 'class-validator';

export class RegistrationInputModel {
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  @MaxLength(256)
  username: string;
  @IsOptional()
  @IsString()
  firstName?: string;
  @IsOptional()
  @IsString()
  lastName?: string;
  @IsOptional()
  @IsString()
  phone?: string;
}
