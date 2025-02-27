import { ReserveCourierType } from './reserve-courier.type';

export class ReserveCourierCommand {
  constructor(
    public readonly eventId: string,
    public readonly reserveCourier: ReserveCourierType,
  ) {}
}
