import { DeductFundsDto } from './deduct-funds.dto';

export class DeductFundsCommand {
  constructor(
    public eventId: string,
    public deductFundsDto: DeductFundsDto,
  ) {}
}
