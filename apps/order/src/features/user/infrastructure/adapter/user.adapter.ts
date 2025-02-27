import { Injectable } from '@nestjs/common';
import { OrderUserRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IOrderUser, OrderUserEntity } from '../../domain';
import { IdempotencyEntity } from '@app/idempotency/domain';

@Injectable()
export class OrderUserAdapter implements OrderUserRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(OrderUserEntity)
    private readonly userOrderRepository: Repository<OrderUserEntity>,
  ) {}

  async save(user: IOrderUser): Promise<IOrderUser> {
    return await this.userOrderRepository.save(user);
  }

  async saveUser(eventId: string, user: IOrderUser): Promise<void> {
    await this.saveIdempotency(eventId, user);
  }

  async getUserById(userId: number): Promise<IOrderUser> {
    return await this.userOrderRepository.findOneBy({ id: userId });
  }

  private async saveIdempotency(
    eventId: string,
    user: IOrderUser,
  ): Promise<void> {
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(OrderUserEntity).save(user);
    });
  }
}
