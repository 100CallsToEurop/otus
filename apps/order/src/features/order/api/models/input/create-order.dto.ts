import { Type } from 'class-transformer';
import { IsArray, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray({ each: true })
  @Type(() => Number)
  @IsNumber({}, { each: true })
  productIds: number[];
}
