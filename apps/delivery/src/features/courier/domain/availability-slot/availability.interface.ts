export interface IAvailabilitySlot {
  id: number;
  orderId: number;
  date: Date;

  plainToInstance(): void;
}
