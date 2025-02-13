export class FailFundsOperationEvent {
  constructor(
    public readonly orderId: number,
    public readonly transactionId: string,
    public readonly userId: number,
  ) {}
}
