import { Controller, Get } from '@nestjs/common';
import { MessageFacade } from '../application';
import { MessageViewModel } from './models/views';
import { GetCurrentUserId } from '@app/common/decorators';

@Controller('notifications')
export class MessageController {
  constructor(private readonly messageFacade: MessageFacade) {}

  @Get('messages')
  async getMessage(
    @GetCurrentUserId() userId: number,
  ): Promise<MessageViewModel[]> {
    return this.messageFacade.queries.getMessages(userId);
  }
}
