import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { UserBillingFacade } from './user-billing.facade';

export const userBillingFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new UserBillingFacade(commandBus, eventBus, queryBus);
