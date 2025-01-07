import { PlaceOrderDto } from './place-order.dto';

export class PlaceOrderCommand {
  constructor(public placeOrderDto: PlaceOrderDto) {}
}
