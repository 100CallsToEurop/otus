import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IUser, UserEntity } from '../../domain/user';
import { UserRepository } from '../repository/user.repository';
import { OutboxEntity } from '@app/outbox/domain';
import {
  RegistrationUserContract,
  UpdateUserContract,
} from '@app/amqp-contracts/queues/auth';

@Injectable()
export class UserAdapter implements UserRepository {
  private logger = new Logger(UserAdapter.name);
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async save(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }

  async saveUser(user: IUser): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const { id } = await manager.getRepository(UserEntity).save(user);
      const outboxPayload = {
        routingKey: RegistrationUserContract.queue.routingKey,
        eventType: 'user.created',
        payload: {
          userId: id,
          email: user.email,
          fullName: user.profile.getFullName(),
        },
      };
      const outbox = OutboxEntity.create(outboxPayload);
      await manager.getRepository(OutboxEntity).save(outbox);
    });
  }

  async updateUser(user: IUser): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const { id } = await manager.getRepository(UserEntity).save(user);
      const outboxPayload = {
        routingKey: UpdateUserContract.queue.routingKey,
        eventType: 'user.updated',
        payload: {
          userId: id,
          email: user.email,
          fullName: user.profile.getFullName(),
        },
      };
      const outbox = OutboxEntity.create(outboxPayload);
      await manager.getRepository(OutboxEntity).save(outbox);
    });
  }
  async findById(userId: number): Promise<IUser | null> {
    const result = await this.userRepository
      .findOne({ where: { id: userId }, relations: { profile: true } })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    return result;
  }
  async delete(userId: number): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<IUser | null> {
    return await this.userRepository.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });
  }
}
