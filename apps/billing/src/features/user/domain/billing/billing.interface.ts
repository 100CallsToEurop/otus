import { IWallet } from '../wallet';

export interface IBilling {
  id: number;
  email: string;
  fullName: string;
  wallet: IWallet;

  addWalletFunds(amount: number): void;
  deductWalletFunds(amount: number): boolean;
  getWalletFunds(): number;
  plainToInstance(): void;
}
