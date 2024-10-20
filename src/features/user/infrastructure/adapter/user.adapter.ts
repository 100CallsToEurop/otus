import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUser, UserEntity } from '../../domain';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class UserAdapter implements UserRepository {
  private logger = new Logger(UserAdapter.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}
  async save(user: IUser): Promise<IUser> {
    return await this.userRepository.save(user);
  }
  async findById(userId: number): Promise<IUser | null> {
    const result = await this.userRepository
      .findOne({ where: { id: userId } })
      .catch((err) => {
        this.logger.error(err);
        return null;
      });
    return result;
  }
  async delete(userId: number): Promise<void> {
    await this.userRepository.delete({ id: userId });
  }
}
