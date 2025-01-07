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
    @Body() dto: CreateOrderDto,
  ): Promise<{ orderId: number }> {
    return this.orderFacade.commands.createOrder({
      userId,
      ...dto,
    });
  }

  @Get(':orderId')
  async getOrders(
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderViewModel> {
    return this.orderFacade.queries.getOrder(orderId);
  }
}
