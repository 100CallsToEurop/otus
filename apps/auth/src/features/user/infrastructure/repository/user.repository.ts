import { IUser } from '../../domain/user';

export abstract class UserRepository {
  abstract save(user: IUser): Promise<IUser>;
  abstract saveUser(user: IUser): Promise<void>;
  abstract findById(userId: number): Promise<IUser | null>;
  abstract delete(userId: number): Promise<void>;
  abstract findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<IUser | null>;
}
