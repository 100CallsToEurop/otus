import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { ProductFacade } from './product.facade';

export const productFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new ProductFacade(commandBus, eventBus, queryBus);
