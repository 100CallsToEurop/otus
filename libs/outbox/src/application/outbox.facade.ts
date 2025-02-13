import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  OutboxStartEventProcessCommand,
  OutboxStartEventProcessCommandHandler,
} from './commands/outbox-start-event-process';

export class OutboxFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    start_event_process: () => this.start_event_process(),
  };

  @Cron(CronExpression.EVERY_5_SECONDS)
  private start_event_process() {
    return this.commandBus.execute<
      OutboxStartEventProcessCommand,
      Awaited<ReturnType<OutboxStartEventProcessCommandHandler['execute']>>
    >(new OutboxStartEventProcessCommand());
  }
}
