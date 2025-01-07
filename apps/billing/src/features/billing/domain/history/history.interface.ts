import { IBilling } from '../billing';

export interface IHistory {
  id: number;
  orderId: number;
  balance: number;
  withdrawalAmount: number;
  transactionDate: Date;
  billing: IBilling;
}
