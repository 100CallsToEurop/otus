import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IMessage, MessageEntity } from '../../domain';
import { IdempotencyEntity } from '@app/idempotency/domain';

@Injectable()
export class MessageAdapter implements MessageRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}
  async save(order: IMessage): Promise<IMessage> {
    return await this.messageRepository.save(order);
  }

  async saveMessage(eventId: string, message: IMessage): Promise<void> {
    await this.saveIdempotency(eventId, message);
  }

  async getAll(userId: number): Promise<IMessage[]> {
    return await this.messageRepository.find({
      where: { userId },
    });
  }

  private async saveIdempotency(
    eventId: string,
    message: IMessage,
  ): Promise<void> {
    const idempotency = IdempotencyEntity.create({ eventId });

    await this.dataSource.transaction(async (manager) => {
      await manager.getRepository(IdempotencyEntity).save(idempotency);
      await manager.getRepository(MessageEntity).save(message);
    });
  }
}
