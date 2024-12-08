import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { UserRepository } from '../../../infrastructure/repository';
import { UserResponse } from '../../../domain/user';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, UserResponse>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute({ userId }: GetUserQuery): Promise<UserResponse> {
    const user = await this.userRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new UserResponse(user);
  }
}
