import { IAvailabilitySlot } from '../availability-slot';

export interface ICourier {
  id: number;
  fullName: string;
  availabilitySlots: IAvailabilitySlot[];

  addSlot(orderId: number, date: Date): void;
  deleteSlot(orderId: number): void;
  plainToInstance(): void;
}
