import { DeductFundsDto } from './deduct-funds.dto';

export class DeductFundsCommand {
  constructor(public deductFundsDto: DeductFundsDto) {}
}
