import { IOutbox } from '@app/outbox/domain';

export abstract class OutboxRepository {
  abstract findByEventId(event_id: string): Promise<boolean>;
  abstract getWaitingData(): Promise<[IOutbox[], number]>;
  abstract deleteProcessedData(): Promise<void>;
  abstract getProcessedData(): Promise<[IOutbox[], number]>;
  abstract delete(outboxId: number): Promise<void>;
}
