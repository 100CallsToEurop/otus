import {
  Body,
  Controller,
  Get,
  HttpCode,
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

  @HttpCode(200)
  @Post(':userId/order/:orderId/pay')
  async payOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<{ orderId: number }> {
    return this.orderFacade.commands.payOrder(userId, orderId);
  }

  @Get(':userId')
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderViewModel[]> {
    return this.orderFacade.queries.getOrders(userId);
  }
}
