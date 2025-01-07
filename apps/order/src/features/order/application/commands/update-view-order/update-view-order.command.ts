import { UpdateViewOrderDto } from './update-view-order.dto';

export class UpdateViewOrderCommand {
  constructor(public orderDto: UpdateViewOrderDto) {}
}
