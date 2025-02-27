import { CancelReserveProductType } from './cancel-reserve.type';

export class CancelReserveProductCommand {
  constructor(
    public readonly eventId: string,
    public readonly cancelReserveProduct: CancelReserveProductType,
  ) {}
}
