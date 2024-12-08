import { CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import {
  CreateMessageCommand,
  CreateMessageCommandHandler,
  CreateMessageDto,
} from './commands/create-messages';
import {
  GetMessagesQuery,
  GetMessagesQueryHandler,
} from './queries/get-messages';

export class MessageFacade {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
    private readonly queryBus: QueryBus,
  ) {}

  commands = {
    createMessage: (createOrderDto: CreateMessageDto) =>
      this.createMessage(createOrderDto),
  };
  queries = {
    getMessages: (userId: number) => this.getMessages(userId),
  };

  createMessage(createProductDto: CreateMessageDto) {
    return this.commandBus.execute<
      CreateMessageCommand,
      Awaited<ReturnType<CreateMessageCommandHandler['execute']>>
    >(new CreateMessageCommand(createProductDto));
  }
  getMessages(userId: number) {
    return this.queryBus.execute<
      GetMessagesQuery,
      Awaited<ReturnType<GetMessagesQueryHandler['execute']>>
    >(new GetMessagesQuery(userId));
  }
}