import { CancelPaymentType } from './cancel-payment.type';

export class CancelPaymentCommand {
  constructor(
    public eventId: string,
    public cancelPaymentDto: CancelPaymentType,
  ) {}
}
