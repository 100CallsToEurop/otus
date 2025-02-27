import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from './create-message.command';
import { MessageRepository } from '../../../infrastructure/repository';
import { MessageEntity } from '../../../domain';

@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler
  implements ICommandHandler<CreateMessageCommand, void>
{
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute({ eventId, messageDto }: CreateMessageCommand): Promise<void> {
    const newMessage = MessageEntity.create(messageDto);
    await this.messageRepository.saveMessage(eventId, newMessage);
  }
}
