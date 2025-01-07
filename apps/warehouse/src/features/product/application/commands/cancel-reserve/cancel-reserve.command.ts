import { CancelReserveProductType } from './cancel-reserve.type';

export class CancelReserveProductCommand {
  constructor(public readonly cancelReserveProduct: CancelReserveProductType) {}
}
