import { AuthFacade } from './auth.facade';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

export const authFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new AuthFacade(commandBus, eventBus, queryBus);
