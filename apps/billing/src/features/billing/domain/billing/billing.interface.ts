import { IHistory } from '../history';
import { IWallet } from '../wallet';

export interface IBilling {
  id: number;
  email: string;
  fullName: string;
  wallet: IWallet;
  histories: IHistory[];

  addWalletFunds(amount: number): void;
  deductWalletFunds(
    orderId: number,
    transactionId: string,
    amount: number,
  ): boolean;
  cancelTransaction(orderId: number, transactionId: string): void;
  getWalletFunds(): number;
  plainToInstance(): void;
}
