import { IsArray, IsDate, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  orderId: number;

  @IsArray()
  itemsIds: number[];

  @IsNumber()
  totalPrice: number;

  @IsDate()
  deliveryDate: Date;
}
