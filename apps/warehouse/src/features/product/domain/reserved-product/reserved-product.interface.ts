export interface IReservedProduct {
  id: number;
  orderId: number;
  quantity: number;
  price: number;

  plainToInstance(): void;
}
