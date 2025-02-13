import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutboxStartEventProcessCommand } from './outbox-start-event-process.command';
import { Logger } from '@nestjs/common';
import { OutboxRepository } from '../../../infrastructure/repository';
import { IOutbox } from '@app/outbox/domain';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { OutboxContract } from '@app/amqp-contracts/queues/outbox';

@CommandHandler(OutboxStartEventProcessCommand)
export class OutboxStartEventProcessCommandHandler
  implements ICommandHandler<OutboxStartEventProcessCommand, void>
{
  private readonly logger = new Logger(
    OutboxStartEventProcessCommandHandler.name,
  );
  constructor(
    public readonly amqpConnection: AmqpConnection,
    private readonly outboxRepository: OutboxRepository,
  ) {}

  private async sendData(data: IOutbox): Promise<void> {
    const { eventId, payload, routingKey } = data;
    try {
      await this.amqpConnection.publish(
        OutboxContract.queue.exchange.name,
        routingKey,
        {
          eventId,
          payload,
        },
      );
      // await this.outboxRepository.delete(data.id);
    } catch (err) {
      this.logger.error(
        `Ошибка при отправке данных в RabbitMq для outboxId: ${data.id}: ${err}`,
      );
    }
  }

  async execute(): Promise<void> {
    const [outboxData, count] = await this.outboxRepository.getWaitingData();
    if (!count) return;
    for (const data of outboxData) {
      await this.sendData(data);
    }
  }
}
