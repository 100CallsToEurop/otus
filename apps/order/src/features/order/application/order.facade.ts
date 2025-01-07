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

export class OrderFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createOrder: (createOrderDto: CreateOrderDto) =>
      this.createOrder(createOrderDto),
    updateViewOrder: (dto: UpdateViewOrderDto) => this.updateViewOrder(dto),
    placeOrder: (dto: PlaceOrderDto) => this.placeOrder(dto),
  };
  queries = {
    getOrder: (userId: number) => this.getOrder(userId),
  };

  private createOrder(createProductDto: CreateOrderDto) {
    return this.commandBus.execute<
      CreateOrderCommand,
      Awaited<ReturnType<CreateOrderCommandHandler['execute']>>
    >(new CreateOrderCommand(createProductDto));
  }

  private placeOrder(dto: PlaceOrderDto) {
    return this.commandBus.execute<
      PlaceOrderCommand,
      Awaited<ReturnType<PlaceOrderCommandHandler['execute']>>
    >(new PlaceOrderCommand(dto));
  }

  private updateViewOrder(dto: UpdateViewOrderDto) {
    return this.commandBus.execute<
      UpdateViewOrderCommand,
      Awaited<ReturnType<UpdateViewOrderCommandHandler['execute']>>
    >(new UpdateViewOrderCommand(dto));
  }

  private getOrder(orderId: number) {
    return this.queryBus.execute<
      GetOrderQuery,
      Awaited<ReturnType<GetOrderQueryHandler['execute']>>
    >(new GetOrderQuery(orderId));
  }
}
