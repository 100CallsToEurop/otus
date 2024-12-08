import { CreateMessageDto } from './create-message.dto';

export class CreateMessageCommand {
  constructor(public messageDto: CreateMessageDto) {}
}
