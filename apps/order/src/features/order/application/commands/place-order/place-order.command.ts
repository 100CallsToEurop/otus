import { PlaceOrderDto } from './place-order.dto';

export class PlaceOrderCommand {
  constructor(
    public eventId: string,
    public placeOrderDto: PlaceOrderDto,
  ) {}
}
