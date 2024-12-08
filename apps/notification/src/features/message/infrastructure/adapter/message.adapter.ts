import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IMessage, MessageEntity } from '../../domain';

@Injectable()
export class MessageAdapter implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}
  async save(order: IMessage): Promise<IMessage> {
    return await this.messageRepository.save(order);
  }
  async getAll(userId: number): Promise<IMessage[]> {
    return await this.messageRepository.find({
      where: { userId },
    });
  }
}
