import { IOrderUser } from '../../domain';

export abstract class OrderUserRepository {
  abstract save(user: IOrderUser): Promise<IOrderUser>;
  abstract saveUser(eventId: string, user: IOrderUser): Promise<void>;
  abstract getUserById(userId: number): Promise<IOrderUser>;
}
