import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BillingRepository } from '../../../infrastructure/repository';
import { BillingEntity } from '../../../domain/billing';
import { CreateUserCommand } from '../create-user';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, { userId: number }>
{
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    createUserDto,
  }: CreateUserCommand): Promise<{ userId: number }> {
    const newProduct = BillingEntity.create(createUserDto);
    const user = await this.userRepository.save(newProduct);
    return { userId: user.id };
  }
}
