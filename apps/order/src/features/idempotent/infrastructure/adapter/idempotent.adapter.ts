import { Injectable } from '@nestjs/common';
import { IdempotentRepository } from '../repository';
import { IdempotentEntity, IIdempotent } from '../../domain';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdempotentAdapter implements IdempotentRepository {
  constructor(
    @InjectRepository(IdempotentEntity)
    private readonly idempotentRepository: Repository<IdempotentEntity>,
  ) {}
  async save(idempotent: IIdempotent): Promise<IIdempotent> {
    return await this.idempotentRepository.save(idempotent);
  }
  async checkById(id: string): Promise<IIdempotent | null> {
    return await this.idempotentRepository.findOneBy({ id });
  }
}
