import { IBilling } from '../billing';

export interface IHistory {
  id: number;
  orderId: number;
  transactionId: string;
  balance: number;
  withdrawalAmount: number;
  transactionDate: Date;
  billing: IBilling;
}
