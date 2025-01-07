import { IsString, MaxLength } from 'class-validator';

export class CreateCourierInputModel {
  @IsString()
  @MaxLength(256)
  fullName: string;
}
