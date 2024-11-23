import { AuthFacade } from './auth.facade';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

export const authFacadeFactory = (commandBus: CommandBus, queryBus: QueryBus) =>
  new AuthFacade(commandBus, queryBus);
