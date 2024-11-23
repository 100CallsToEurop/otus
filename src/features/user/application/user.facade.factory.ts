import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { UserFacade } from './user.facade';

export const userFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new UserFacade(commandBus, eventBus, queryBus);
