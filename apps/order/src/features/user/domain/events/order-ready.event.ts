export class OrderReadyEvent {
  constructor(
    public orderId: number,
    public userId: number,
    public result: boolean,
  ) {}
}
