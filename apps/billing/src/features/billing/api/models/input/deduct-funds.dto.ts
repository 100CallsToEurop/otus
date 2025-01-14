import { IsNumber, IsString, IsUUID } from 'class-validator';

export class DeductFundsDto {
  @IsNumber()
  userId: number;
  @IsNumber()
  orderId: number;
  @IsString()
  @IsUUID()
  transactionId: string;
  @IsNumber()
  amount: number;
}
