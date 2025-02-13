import { Injectable } from '@nestjs/common';
import { OrderUserRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderUser, OrderUserEntity } from '../../domain';

@Injectable()
export class OrderUserAdapter implements OrderUserRepository {
  constructor(
    @InjectRepository(OrderUserEntity)
    private readonly userOrderRepository: Repository<OrderUserEntity>,
  ) {}

  async save(user: IOrderUser): Promise<IOrderUser> {
    return await this.userOrderRepository.save(user);
  }

  async getUserById(userId: number): Promise<IOrderUser> {
    return await this.userOrderRepository.findOneBy({ id: userId });
  }
}
