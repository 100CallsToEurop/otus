import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { MessageFacade } from '../application';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { CreateMessageDto } from './models/input';

@Controller()
export class MessageEventController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly messageFacade: MessageFacade,
  ) {}

  onModuleInit() {
    const requestPatterns = ['notification-message'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @EventPattern('notification-message')
  async createMessage(@Payload() payload: CreateMessageDto) {
    await this.messageFacade.commands.createMessage(payload);
  }
}
