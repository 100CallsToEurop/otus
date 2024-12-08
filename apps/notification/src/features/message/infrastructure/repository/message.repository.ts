import { IMessage } from '../../domain';

export abstract class MessageRepository {
  abstract save(message: IMessage): Promise<IMessage>;
  abstract getAll(userId: number): Promise<IMessage[]>;
}
