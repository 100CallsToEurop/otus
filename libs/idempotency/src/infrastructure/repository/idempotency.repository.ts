import { IIdempotency } from '@app/idempotency/domain';

export abstract class IdempotencyRepository {
  abstract save(idempotency: IIdempotency): Promise<void>;
  abstract findByEventId(eventId: string): Promise<boolean>;
}
