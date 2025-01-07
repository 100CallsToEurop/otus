export interface IWallet {
  id: number;
  balance: number;

  addFunds(amount: number): void;
  deductFunds(amount: number): void;
  getFunds(): number;
  plainToInstance(): void;
}
