import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateMessageCommand } from './create-message.command';
import { MessageRepository } from '../../../infrastructure/repository';
import { MessageEntity } from '../../../domain';

@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler
  implements ICommandHandler<CreateMessageCommand, { messageId: number }>
{
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute({
    messageDto,
  }: CreateMessageCommand): Promise<{ messageId: number }> {
    const newMessage = MessageEntity.create(messageDto);
    await this.messageRepository.save(newMessage);
    return { messageId: newMessage.id };
  }
}
