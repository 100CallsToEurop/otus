import { CancelPaymentType } from './cancel-payment.type';

export class CancelPaymentCommand {
  constructor(public cancelPaymentDto: CancelPaymentType) {}
}
