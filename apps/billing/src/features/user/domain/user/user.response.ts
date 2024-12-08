import { IUser } from './user.interface';

export class UserResponse {
  id: number;
  email: string;
  fullName: string;
  balance: number;

  constructor(user: IUser) {
    this.id = user.id;
    this.email = user.email;
    this.fullName = user.fullName;
    this.balance = user.getWalletFunds();
  }
}
