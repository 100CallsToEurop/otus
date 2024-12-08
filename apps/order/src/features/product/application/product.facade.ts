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

export class ProductFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createProduct: (createProductDto: CreateProductDto) =>
      this.createProduct(createProductDto),
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
}
