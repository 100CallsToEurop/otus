export class FailReservedCourierEvent {
  constructor(
    public readonly orderId: number,
    public readonly transactionId: string,
  ) {}
}
