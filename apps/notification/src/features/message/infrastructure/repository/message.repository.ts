import { IMessage } from '../../domain';

export abstract class MessageRepository {
  abstract save(message: IMessage): Promise<IMessage>;
  abstract saveMessage(eventId: string, message: IMessage): Promise<void>;
  abstract getAll(userId: number): Promise<IMessage[]>;
}
