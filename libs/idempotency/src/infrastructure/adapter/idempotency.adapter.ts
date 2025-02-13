import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdempotencyRepository } from '../repository';
import { IdempotencyEntity, IIdempotency } from '@app/idempotency/domain';

@Injectable()
export class IdempotencyAdapter implements IdempotencyRepository {
  readonly logger: Logger = new Logger(IdempotencyAdapter.name);
  constructor(
    @InjectRepository(IdempotencyEntity)
    private readonly idempotencyRepository: Repository<IdempotencyEntity>,
  ) {}
  async save(idempotency: IIdempotency): Promise<void> {
    await this.idempotencyRepository.save(idempotency);
  }
  async findByEventId(eventId: string): Promise<boolean> {
    return !!(await this.idempotencyRepository.count({ where: { eventId } }));
  }
}
