export interface IProduct {
  id: number;
  name: string;
  price: number;

  plainToInstance(): void;
}
