import { ReserveCourierType } from './reserve-courier.type';

export class ReserveCourierCommand {
  constructor(public readonly reserveCourier: ReserveCourierType) {}
}
