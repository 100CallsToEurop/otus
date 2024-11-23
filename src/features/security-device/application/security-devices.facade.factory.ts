import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { SecurityDevicesFacade } from './security-devices.facade';

export const securityDevicesFacadeFactory = (
  commandBus: CommandBus,
  eventBus: EventBus,
  queryBus: QueryBus,
) => new SecurityDevicesFacade(commandBus, eventBus, queryBus);
