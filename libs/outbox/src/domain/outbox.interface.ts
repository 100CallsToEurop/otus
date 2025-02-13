import { OUTBOX_STATUS } from '@app/consts';

export interface IOutbox {
  id: number;
  eventId: string;
  eventType: string;
  payload: Record<string, any>;
  status: OUTBOX_STATUS;
  createdAt: Date;
  routingKey: string;

  plainToInstance(): void;
}
