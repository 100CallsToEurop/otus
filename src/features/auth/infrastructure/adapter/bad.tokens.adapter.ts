import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BadTokenEntity, IBadToken } from '../../domain';
import { BadTokenRepository } from '../repository';

@Injectable()
export class BadTokensAdapter implements BadTokenRepository {
  logger: Logger = new Logger(BadTokensAdapter.name);
  constructor(
    @InjectRepository(BadTokenEntity)
    private readonly badTokensRepository: Repository<BadTokenEntity>,
  ) {}

  async save(token: IBadToken): Promise<IBadToken> {
    return await this.badTokensRepository.save(token);
  }

  async deleteTokens(tokens: Array<string>): Promise<void> {
    await this.badTokensRepository.delete({
      token: In(tokens),
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<IBadToken> {
    return await this.badTokensRepository.findOneBy({
      token: refreshToken,
    });
  }

  async getTokens(): Promise<IBadToken[]> {
    return await this.badTokensRepository.find();
  }
}
