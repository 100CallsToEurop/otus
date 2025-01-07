import { CancelReserveCourierType } from './cancel-reserve.type';

export class CancelReserveCourierCommand {
  constructor(public readonly cancelReserveCourier: CancelReserveCourierType) {}
}
