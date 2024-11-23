import {
  MaxLength,
  IsString,
  Matches,
  IsOptional,
  IsEmail,
} from 'class-validator';

export class RegistrationInputModel {
  @IsOptional()
  @IsString()
  @IsEmail()
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
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message: 'phone must be a valid phone number',
  })
  @IsString()
  phone?: string;
}
