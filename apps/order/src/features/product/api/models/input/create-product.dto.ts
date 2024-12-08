import { IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MaxLength(256)
  name: string;
  @IsNumber()
  @Min(0)
  price: number;
}
