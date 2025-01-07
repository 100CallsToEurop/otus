import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { BillingEntity } from '../../../domain/billing';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, { userId: number }>
{
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    createUserDto,
  }: CreateUserCommand): Promise<{ userId: number }> {
    const newUser = BillingEntity.create({
      ...createUserDto,
      id: createUserDto.userId,
    });
    const user = await this.userRepository.save(newUser);
    return { userId: user.id };
  }
}
