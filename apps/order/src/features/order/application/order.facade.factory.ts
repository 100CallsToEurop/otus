import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { OrderFacade } from './order.facade';

export const orderFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new OrderFacade(commandBus, eventBus, queryBus);
