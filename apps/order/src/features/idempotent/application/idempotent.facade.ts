import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateKeyCommand,
  CreateKeyCommandHandler,
} from './commands/create-key';
import { CheckKeyQuery, CheckKeyQueryHandler } from './queries/check-key';

export class IdempotentFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createKey: (id: string) => this.createKey(id),
  };

  queries = {
    checkKey: (id: string) => this.checkKey(id),
  };

  private createKey(id: string) {
    return this.commandBus.execute<
      CreateKeyCommand,
      Awaited<ReturnType<CreateKeyCommandHandler['execute']>>
    >(new CreateKeyCommand(id));
  }

  private checkKey(id: string) {
    return this.queryBus.execute<
      CheckKeyQuery,
      Awaited<ReturnType<CheckKeyQueryHandler['execute']>>
    >(new CheckKeyQuery(id));
  }
}
