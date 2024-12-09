import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MessageFacade } from '../application';
import { MessageViewModel } from './models/views';

@Controller('notifications/:userId/messages')
export class MessageController {
  constructor(private readonly messageFacade: MessageFacade) {}

  @Get()
  async getProducts(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<MessageViewModel[]> {
    console.log(1)
    return this.messageFacade.queries.getMessages(userId);
  }
}
