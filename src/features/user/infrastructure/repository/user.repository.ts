import { IUser } from '../../domain';

export abstract class UserRepository {
  abstract save(user: IUser): Promise<IUser>;
  abstract findById(userId: number): Promise<IUser | null>;
  abstract delete(userId: number): Promise<void>;
}
