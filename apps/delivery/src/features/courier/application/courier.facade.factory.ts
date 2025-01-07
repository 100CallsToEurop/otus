import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { CourierFacade } from './courier.facade';

export const courierFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new CourierFacade(commandBus, eventBus, queryBus);
