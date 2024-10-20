import { IsString, MaxLength } from 'class-validator';
import { UpdateUserDto } from './update-user.dto.input.model';

export class CreateUserDto extends UpdateUserDto {
  @IsString()
  @MaxLength(256)
  username: string;
}
