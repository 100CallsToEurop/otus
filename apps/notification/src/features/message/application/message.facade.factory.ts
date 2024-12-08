import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { MessageFacade } from './message.facade';

export const messageFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new MessageFacade(commandBus, eventBus, queryBus);
