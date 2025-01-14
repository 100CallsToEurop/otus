export interface IAvailabilitySlot {
  id: number;
  orderId: number;
  transactionId: string;
  date: Date;

  plainToInstance(): void;
}
