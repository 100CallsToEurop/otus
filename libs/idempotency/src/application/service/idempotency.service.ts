import { IdempotencyRepository } from '../../infrastructure/repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IdempotencyService {
  constructor(private readonly idempotencyRepository: IdempotencyRepository) {}

  async checkIdempotency(eventId: string): Promise<boolean> {
    return await this.idempotencyRepository.findByEventId(eventId);
  }
}
