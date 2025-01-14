import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { IdempotentFacade } from './idempotent.facade';

export const idempotentFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new IdempotentFacade(commandBus, eventBus, queryBus);
