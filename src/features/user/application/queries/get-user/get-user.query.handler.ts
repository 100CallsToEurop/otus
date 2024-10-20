import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from '../../../infrastructure/repository';
import { Logger, NotFoundException } from '@nestjs/common';
import { UserResponse } from '../../../domain/';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserResponse>
{
  private logger = new Logger(GetUserQueryHandler.name);
  constructor(private readonly userRepository: UserRepository) {}
  async execute({ userId }: GetUserQuery): Promise<UserResponse> {
    this.logger.log(`Get user ${userId}`);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponse(user);
  }
}
