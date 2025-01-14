import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IdempotentRepository } from '../../../infrastructure/repository';
import { CreateKeyCommand } from './create-key.command';
import { IdempotentEntity } from '../../../domain';

@CommandHandler(CreateKeyCommand)
export class CreateKeyCommandHandler
  implements ICommandHandler<CreateKeyCommand, void>
{
  constructor(private readonly idempotentRepository: IdempotentRepository) {}
  async execute({ id }: CreateKeyCommand): Promise<void> {
    const idempotent = IdempotentEntity.create(id);
    await this.idempotentRepository.save(idempotent);
  }
}
