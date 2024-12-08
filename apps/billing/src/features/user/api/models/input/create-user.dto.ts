import { IsEmail, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  fullName: string;
}
