export class FundsOperationEvent {
  constructor(
    public readonly userId: number,
    public readonly orderId: number,
    public readonly result: boolean,
  ) {}
}
