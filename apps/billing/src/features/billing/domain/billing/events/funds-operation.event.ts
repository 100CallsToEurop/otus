export class FundsOperationEvent {
  constructor(
    public readonly userId: number,
    public readonly orderId: number,
    public readonly transactionId: string,
    public readonly result: boolean,
  ) {}
}
