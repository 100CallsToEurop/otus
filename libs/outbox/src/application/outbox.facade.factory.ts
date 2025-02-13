import { OutboxFacade } from './outbox.facade';
import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';

export const outboxFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new OutboxFacade(commandBus, eventBus, queryBus);
