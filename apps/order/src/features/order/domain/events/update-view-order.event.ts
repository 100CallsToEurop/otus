import { STATUS_ORDER } from '@app/consts';

export class UpdateViewOrderStatusEvent {
  constructor(
    public orderId: number,
    public transactionId: string,
    public status: STATUS_ORDER,
  ) {}
}
