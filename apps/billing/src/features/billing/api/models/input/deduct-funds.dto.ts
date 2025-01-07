import { IsNumber } from 'class-validator';

export class DeductFundsDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  orderId: number;
  @IsNumber()
  amount: number;
}
