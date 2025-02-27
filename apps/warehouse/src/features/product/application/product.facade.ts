import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateProductCommand,
  CreateProductCommandHandler,
  CreateProductDto,
} from './commands/create-product';
import {
  GetProductsQuery,
  GetProductsQueryHandler,
} from './queries/get-products';
import {
  CancelReserveProductType,
  CancelReserveProductCommand,
  CancelReserveProductCommandHandler,
} from './commands/cancel-reserve';
import {
  ReserveProductType,
  ReserveProductCommand,
  ReserveProductCommandHandler,
} from './commands/reserve-product';

export class ProductFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createProduct: (createProductDto: CreateProductDto) =>
      this.createProduct(createProductDto),
    reserve: (eventId: string, dto: ReserveProductType) =>
      this.reserve(eventId, dto),
    cancelReserve: (eventId: string, dto: CancelReserveProductType) =>
      this.cancelReserve(eventId, dto),
  };
  queries = {
    getAllProducts: () => this.getAllProducts(),
  };

  createProduct(createProductDto: CreateProductDto) {
    return this.commandBus.execute<
      CreateProductCommand,
      Awaited<ReturnType<CreateProductCommandHandler['execute']>>
    >(new CreateProductCommand(createProductDto));
  }
  getAllProducts() {
    return this.queryBus.execute<
      GetProductsQuery,
      Awaited<ReturnType<GetProductsQueryHandler['execute']>>
    >(new GetProductsQuery());
  }

  async reserve(eventId: string, dto: ReserveProductType) {
    return this.commandBus.execute<
      ReserveProductCommand,
      Awaited<ReturnType<ReserveProductCommandHandler['execute']>>
    >(new ReserveProductCommand(eventId, dto));
  }

  async cancelReserve(eventId: string, dto: CancelReserveProductType) {
    return this.commandBus.execute<
      CancelReserveProductCommand,
      Awaited<ReturnType<CancelReserveProductCommandHandler['execute']>>
    >(new CancelReserveProductCommand(eventId, dto));
  }
}
