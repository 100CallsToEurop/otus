import { ReserveProductType } from './reserve-product.type';

export class ReserveProductCommand {
  constructor(public readonly reserveProduct: ReserveProductType) {}
}
