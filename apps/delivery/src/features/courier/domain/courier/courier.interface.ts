import { IAvailabilitySlot } from '../availability-slot';

export interface ICourier {
  id: number;
  fullName: string;
  availabilitySlots: IAvailabilitySlot[];

  addSlot(orderId: number, transactionId: string, date: Date): void;
  deleteSlot(orderId: number, transactionId: string): void;
  plainToInstance(): void;
}
