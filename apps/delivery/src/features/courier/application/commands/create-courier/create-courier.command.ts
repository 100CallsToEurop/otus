import { CreateCourierType } from './create-courier.type';

export class CreateCourierCommand {
  constructor(public readonly createCourier: CreateCourierType) {}
}
