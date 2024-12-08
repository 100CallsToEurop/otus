import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OrderFacade } from '../application';
import { CreateOrderDto } from './models/input';
import { OrderViewModel } from './models/views';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderFacade: OrderFacade) {}

  @Post(':userId')
  async createOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() { productIds }: CreateOrderDto,
  ): Promise<{ orderId: number }> {
    return this.orderFacade.commands.createOrder({ userId, productIds });
  }

  @Get(':userId')
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderViewModel[]> {
    return this.orderFacade.queries.getOrders(userId);
  }
}
