import {
  BadRequestException,
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
import { RequestId } from '@app/common/decorators';
import { IdempotentFacade } from '../../idempotent/application';

@Controller('users/:userId/orders')
export class OrderController {
  constructor(
    private readonly orderFacade: OrderFacade,
    private readonly idempotentFacade: IdempotentFacade,
  ) {}

  private async createKey(requestId: string): Promise<void> {
    if (!requestId) return;
    const checkKey = await this.idempotentFacade.queries.checkKey(requestId);
    if (checkKey) {
      throw new BadRequestException('Order already exists');
    }
    await this.idempotentFacade.commands.createKey(requestId);
  }

  @Post()
  async createOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @RequestId() requestId: string,
    @Body() dto: CreateOrderDto,
  ): Promise<{ orderId: number }> {
    await this.createKey(requestId);
    return this.orderFacade.commands.createOrder({
      userId,
      ...dto,
    });
  }

  @Get(':orderId')
  async getOrder(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('orderId', ParseIntPipe) orderId: number,
  ): Promise<OrderViewModel> {
    return this.orderFacade.queries.getOrder(userId, orderId);
  }

  @Get()
  async getOrders(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<OrderViewModel[]> {
    return this.orderFacade.queries.getOrders(userId);
  }
}
