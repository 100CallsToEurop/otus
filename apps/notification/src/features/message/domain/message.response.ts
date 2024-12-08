import { IMessage } from './message.interface';

export class MessageResponse {
  id: number;
  content: string;
  created: string;

  constructor(message: IMessage) {
    this.id = message.id;
    this.content = message.content;
    this.created = message.createdAt.toISOString();
  }
}
