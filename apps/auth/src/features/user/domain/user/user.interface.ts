import { ROLE } from '@app/consts';
import { IProfile } from '../profile';

export interface IUser {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  profile: IProfile;
  role: ROLE;

  update(update: Partial<IUser>): void;
  plainToInstance(): void;
}
