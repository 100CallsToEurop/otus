import { CreateMessageDto } from './create-message.dto';

export class CreateMessageCommand {
  constructor(
    public eventId: string,
    public messageDto: CreateMessageDto,
  ) {}
}
