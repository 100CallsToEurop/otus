import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repository';
import { IUser } from '../../domain/user/user.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../domain/user/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserAdapter implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly productRepository: Repository<UserEntity>,
  ) {}
  async save(product: IUser): Promise<IUser> {
    return await this.productRepository.save(product);
  }

  async getUser(userId: number): Promise<IUser | null> {
    return await this.productRepository.findOne({
      where: { id: userId },
      relations: { wallet: true },
    });
  }
}
