import { IBilling } from './billing.interface';

export class BillingResponse {
  id: number;
  email: string;
  fullName: string;
  balance: number;

  constructor(user: IBilling) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.balance = user.getWalletFunds();
  }
}
