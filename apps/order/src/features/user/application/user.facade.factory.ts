import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { OrderUserFacade } from './user.facade';

export const orderUserFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new OrderUserFacade(commandBus, eventBus, queryBus);
