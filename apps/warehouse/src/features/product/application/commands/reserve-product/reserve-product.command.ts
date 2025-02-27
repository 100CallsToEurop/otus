import { ReserveProductType } from './reserve-product.type';

export class ReserveProductCommand {
  constructor(
    public readonly eventId: string,
    public readonly reserveProduct: ReserveProductType,
  ) {}
}
