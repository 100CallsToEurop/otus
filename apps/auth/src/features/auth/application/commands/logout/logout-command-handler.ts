import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from './logout-command';
import { Logger } from '@nestjs/common';
import { LogoutUserEvent } from '../../../../auth/domain/events';

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler<LogoutCommand> {
  private readonly logger = new Logger(LogoutCommandHandler.name);
  constructor(private readonly eventBus: EventBus) {}

  async execute({ userId, deviceId }: LogoutCommand): Promise<void> {
    await this.eventBus.publish(new LogoutUserEvent(userId, deviceId));
  }
}
