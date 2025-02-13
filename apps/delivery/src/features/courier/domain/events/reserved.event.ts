export class FailReservedEvent {
  constructor(
    public readonly orderId: number,
    public readonly transactionId: string,
  ) {}
}
