import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserQuery } from './get-user.query';
import { BillingRepository } from '../../../infrastructure/repository';
import { BillingResponse } from '../../../domain/billing';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetUserQuery)
export class GetUserQueryHandler
  implements IQueryHandler<GetUserQuery, BillingResponse>
{
  constructor(private readonly userRepository: BillingRepository) {}
  async execute({ userId }: GetUserQuery): Promise<BillingResponse> {
    const user = await this.userRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return new BillingResponse(user);
  }
}
