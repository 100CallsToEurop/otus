import { IdempotencyEntity } from '@app/idempotency/domain';
import { IdempotencyRepository } from '../../infrastructure/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyService {
  constructor(private readonly idempotencyRepository: IdempotencyRepository) {}

  async checkIdempotency(eventId: string): Promise<boolean> {
    const checkEventId =
      await this.idempotencyRepository.findByEventId(eventId);
    if (!checkEventId) {
      await this.idempotencyRepository.save(
        IdempotencyEntity.create({ eventId }),
      );
      return false;
    }
    return true;
  }
}
