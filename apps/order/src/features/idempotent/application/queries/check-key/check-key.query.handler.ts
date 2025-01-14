import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CheckKeyQuery } from './check-key.query';
import { IdempotentRepository } from '../../../infrastructure/repository';

@QueryHandler(CheckKeyQuery)
export class CheckKeyQueryHandler
  implements IQueryHandler<CheckKeyQuery, boolean>
{
  constructor(private readonly idempotentRepository: IdempotentRepository) {}
  async execute({ id }: CheckKeyQuery): Promise<boolean> {
    const idempotent = await this.idempotentRepository.checkById(id);
    return !!idempotent;
  }
}
