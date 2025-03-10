import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateOrderCommand,
  CreateOrderCommandHandler,
  CreateOrderDto,
} from './commands/create-order';
import { GetOrderQuery, GetOrderQueryHandler } from './queries/get-order';
import {
  PlaceOrderCommand,
  PlaceOrderCommandHandler,
  PlaceOrderDto,
} from './commands/place-order';
import {
  UpdateViewOrderCommand,
  UpdateViewOrderCommandHandler,
  UpdateViewOrderDto,
} from './commands/update-view-order';
import { GetOrdersQuery, GetOrdersQueryHandler } from './queries/get-orders';

export class OrderFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createOrder: (createOrderDto: CreateOrderDto) =>
      this.createOrder(createOrderDto),
    updateViewOrder: (eventId: string, dto: UpdateViewOrderDto) =>
      this.updateViewOrder(eventId, dto),
    placeOrder: (eventId: string, dto: PlaceOrderDto) =>
      this.placeOrder(eventId, dto),
  };
  queries = {
    getOrder: (userId: number, orderId: number) =>
      this.getOrder(userId, orderId),
    getOrders: (userId: number) => this.getOrders(userId),
  };

  private createOrder(createProductDto: CreateOrderDto) {
    return this.commandBus.execute<
      CreateOrderCommand,
      Awaited<ReturnType<CreateOrderCommandHandler['execute']>>
    >(new CreateOrderCommand(createProductDto));
  }

  private placeOrder(eventId: string, dto: PlaceOrderDto) {
    return this.commandBus.execute<
      PlaceOrderCommand,
      Awaited<ReturnType<PlaceOrderCommandHandler['execute']>>
    >(new PlaceOrderCommand(eventId, dto));
  }

  private updateViewOrder(eventId: string, dto: UpdateViewOrderDto) {
    return this.commandBus.execute<
      UpdateViewOrderCommand,
      Awaited<ReturnType<UpdateViewOrderCommandHandler['execute']>>
    >(new UpdateViewOrderCommand(eventId, dto));
  }

  private getOrder(userId: number, orderId: number) {
    return this.queryBus.execute<
      GetOrderQuery,
      Awaited<ReturnType<GetOrderQueryHandler['execute']>>
    >(new GetOrderQuery(userId, orderId));
  }

  private getOrders(userId: number) {
    return this.queryBus.execute<
      GetOrdersQuery,
      Awaited<ReturnType<GetOrdersQueryHandler['execute']>>
    >(new GetOrdersQuery(userId));
  }
}
