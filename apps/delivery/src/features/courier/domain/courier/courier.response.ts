import { IAvailabilitySlot } from '../availability-slot';
import { ICourier } from './courier.interface';

export class AvailabilitySlot {
  orderId: number;
  transactionId: string;
  date: Date;

  constructor(slot: IAvailabilitySlot) {
    this.orderId = slot.orderId;
    this.transactionId = slot.transactionId;
    this.date = slot.date;
  }
}

export class CourierResponse {
  id: number;
  fullName: string;
  availabilitySlots: AvailabilitySlot[];

  constructor(courier: ICourier) {
    this.id = courier.id;
    this.fullName = courier.fullName;
    this.availabilitySlots = courier.availabilitySlots.map(
      (slot) => new AvailabilitySlot(slot),
    );
  }
}
