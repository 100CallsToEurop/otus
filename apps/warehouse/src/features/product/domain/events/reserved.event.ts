export class FailReservedProductEvent {
  constructor(
    public readonly orderId: number,
    public readonly transactionId: string,
  ) {}
}
