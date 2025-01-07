import { IsArray, IsDate, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  itemsIds: number[];

  @IsNumber()
  totalPrice: number;

  @IsDate()
  deliveryDate: Date;
}
