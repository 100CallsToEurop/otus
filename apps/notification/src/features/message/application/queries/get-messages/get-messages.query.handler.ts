import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetMessagesQuery } from './get-messages.query';
import { MessageResponse } from '../../../domain';
import { MessageRepository } from '../../../infrastructure/repository';

@QueryHandler(GetMessagesQuery)
export class GetMessagesQueryHandler
  implements IQueryHandler<GetMessagesQuery, MessageResponse[]>
{
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute({ userId }: GetMessagesQuery): Promise<MessageResponse[]> {
    const messages = await this.messageRepository.getAll(userId);
    if (!messages.length) return [];
    return messages.map((message) => new MessageResponse(message));
  }
}
