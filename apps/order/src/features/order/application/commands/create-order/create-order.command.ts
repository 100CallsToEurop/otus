import { CreateOrderDto } from './create-order.dto';

export class CreateOrderCommand {
  constructor(public orderDto: CreateOrderDto) {}
}
