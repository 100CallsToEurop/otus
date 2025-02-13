import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OutboxRepository } from '../repository';
import { IOutbox, OutboxEntity } from '@app/outbox/domain';
import { OUTBOX_STATUS } from '@app/consts';

@Injectable()
export class OutboxAdapter implements OutboxRepository {
  readonly logger: Logger = new Logger(OutboxAdapter.name);
  constructor(
    @InjectRepository(OutboxEntity)
    private readonly outboxRepository: Repository<OutboxEntity>,
  ) {}
  async findByEventId(eventId: string): Promise<boolean> {
    return !!(await this.outboxRepository.count({ where: { eventId } }));
  }
  async getWaitingData(): Promise<[IOutbox[], number]> {
    const [data, count] = await this.outboxRepository.findAndCount({
      where: [
        { status: OUTBOX_STATUS.WAITING },
        { status: OUTBOX_STATUS.FAILED },
      ],
      take: 10,
      order: {
        createdAt: 'DESC',
      },
    });
    // if (!count) this.logger.log('Не найдено ни одного объекта на обработку');
    return [data, count];
  }
  async deleteProcessedData(): Promise<void> {
    await this.outboxRepository.delete({ status: OUTBOX_STATUS.PROCESSED });
  }
  async getProcessedData(): Promise<[IOutbox[], number]> {
    return await this.outboxRepository.findAndCount({
      where: { status: OUTBOX_STATUS.PROCESSED },
    });
  }

  async delete(outboxId: number): Promise<void> {
    await this.outboxRepository.delete(outboxId);
  }
}
