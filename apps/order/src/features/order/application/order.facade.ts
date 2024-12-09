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
import { PayOrderCommand, PayOrderCommandHandler } from './commands/pay-order';

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
    payOrder: (userId: number, orderId: number) =>
      this.payOrder(userId, orderId),
  };
  queries = {
    getOrders: (userId: number) => this.getOrders(userId),
  };

  private createOrder(createProductDto: CreateOrderDto) {
    return this.commandBus.execute<
      CreateOrderCommand,
      Awaited<ReturnType<CreateOrderCommandHandler['execute']>>
    >(new CreateOrderCommand(createProductDto));
  }

  private payOrder(userId: number, orderId: number) {
    return this.commandBus.execute<
      PayOrderCommand,
      Awaited<ReturnType<PayOrderCommandHandler['execute']>>
    >(new PayOrderCommand(userId, orderId));
  }

  private paymentConfirmation(paymentConfirmationDto: PaymentConfirmationDto) {
    return this.commandBus.execute<
      PaymentConfirmationCommand,
      Awaited<ReturnType<PaymentConfirmationCommandHandler['execute']>>
    >(new PaymentConfirmationCommand(paymentConfirmationDto));
  }

  private getOrders(userId: number) {
    return this.queryBus.execute<
      GetOrdersQuery,
      Awaited<ReturnType<GetOrdersQueryHandler['execute']>>
    >(new GetOrdersQuery(userId));
  }
}
