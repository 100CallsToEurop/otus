import { IsNumber } from 'class-validator';

export class AddFundsDto {
  @IsNumber()
  amount: number;
}
