import { IUser } from '../../domain/user/user.interface';

export abstract class UserRepository {
  abstract save(product: IUser): Promise<IUser>;
  abstract getUser(userId: number): Promise<IUser | null>;
}
