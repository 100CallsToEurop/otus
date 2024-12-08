import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserRepository } from '../../../infrastructure/repository';
import { UserEntity } from '../../../domain/user';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, { userId: number }>
{
  constructor(private readonly userRepository: UserRepository) {}

  async execute({
    createUserDto,
  }: CreateUserCommand): Promise<{ userId: number }> {
    const newProduct = UserEntity.create({
      ...createUserDto,
      id: createUserDto.userId,
    });
    const user = await this.userRepository.save(newProduct);
    return { userId: user.id };
  }
}
