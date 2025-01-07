import { IProduct } from '../product';

export class ReservedEvent {
  constructor(
    public readonly orderId: number,
    public readonly reserved: boolean,
    public readonly items: IProduct[],
  ) {}
}
