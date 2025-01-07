import { IHistory } from '../history';
import { IWallet } from '../wallet';

export interface IBilling {
  id: number;
  email: string;
  fullName: string;
  wallet: IWallet;
  histories: IHistory[];

  addWalletFunds(amount: number): void;
  deductWalletFunds(orderId: number, amount: number): boolean;
  cancelTransaction(orderId: number): void;
  getWalletFunds(): number;
  plainToInstance(): void;
}
