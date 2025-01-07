import { STATUS_ORDER } from '@app/consts';

export class UpdateViewOrderStatusEvent {
  constructor(
    public orderId: number,
    public status: STATUS_ORDER,
  ) {}
}
