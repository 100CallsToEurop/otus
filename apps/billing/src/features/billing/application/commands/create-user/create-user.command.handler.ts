import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { BillingRepository } from '../../../infrastructure/repository';
import { BillingEntity } from '../../../domain/billing';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand, { userId: number }>
{
  private readonly logger = new Logger(CreateUserCommandHandler.name);
  constructor(private readonly userRepository: BillingRepository) {}

  async execute({
    createUserDto,
  }: CreateUserCommand): Promise<{ userId: number }> {
    this.logger.log(
      `Create user: userId: ${createUserDto.userId}, email: ${createUserDto.email}`,
    );
    const newUser = BillingEntity.create({
      ...createUserDto,
      id: createUserDto.userId,
    });
    const user = await this.userRepository.save(newUser);
    return { userId: user.id };
  }
}
