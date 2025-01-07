import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  userId: number;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  fullName: string;
}
