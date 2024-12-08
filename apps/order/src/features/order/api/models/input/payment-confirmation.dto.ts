import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class PaymentConfirmationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;
  @IsNotEmpty()
  @IsNumber()
  orderId: number;
  @IsNotEmpty()
  @IsBoolean()
  status: boolean;
}
