export class PayOrderEvent {
  constructor(
    public userId: number,
    public orderId: number,
    public amount: number,
  ) {}
}
