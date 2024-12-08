import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateOrderCommand,
  CreateOrderCommandHandler,
  CreateOrderDto,
} from './commands/create-order';
import { GetOrdersQuery, GetOrdersQueryHandler } from './queries/get-orders';
import {
  PaymentConfirmationCommand,
  PaymentConfirmationCommandHandler,
  PaymentConfirmationDto,
} from './commands/payment-confirmation';

export class OrderFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createOrder: (createOrderDto: CreateOrderDto) =>
      this.createOrder(createOrderDto),
    paymentConfirmation: (paymentConfirmationDto: PaymentConfirmationDto) =>
      this.paymentConfirmation(paymentConfirmationDto),
  };
  queries = {
    getOrders: (userId: number) => this.getOrders(userId),
  };

  createOrder(createProductDto: CreateOrderDto) {
    return this.commandBus.execute<
      CreateOrderCommand,
      Awaited<ReturnType<CreateOrderCommandHandler['execute']>>
    >(new CreateOrderCommand(createProductDto));
  }

  paymentConfirmation(paymentConfirmationDto: PaymentConfirmationDto) {
    return this.commandBus.execute<
      PaymentConfirmationCommand,
      Awaited<ReturnType<PaymentConfirmationCommandHandler['execute']>>
    >(new PaymentConfirmationCommand(paymentConfirmationDto));
  }

  getOrders(userId: number) {
    return this.queryBus.execute<
      GetOrdersQuery,
      Awaited<ReturnType<GetOrdersQueryHandler['execute']>>
    >(new GetOrdersQuery(userId));
  }
}
