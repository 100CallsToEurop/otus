import { PaymentConfirmationDto } from './payment-confirmation.dto';

export class PaymentConfirmationCommand {
  constructor(public paymentConfirmationDto: PaymentConfirmationDto) {}
}
