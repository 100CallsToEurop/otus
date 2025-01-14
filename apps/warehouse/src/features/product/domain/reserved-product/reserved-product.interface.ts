export interface IReservedProduct {
  id: number;
  orderId: number;
  transactionId: string;
  quantity: number;
  price: number;

  plainToInstance(): void;
}
