import { IOrderUser } from '../../domain';

export abstract class OrderUserRepository {
  abstract save(user: IOrderUser): Promise<IOrderUser>;
  abstract getUserById(userId: number): Promise<IOrderUser>;
}
