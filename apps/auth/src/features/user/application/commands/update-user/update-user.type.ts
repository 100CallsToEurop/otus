import { CreateUserType } from '../create-user';

export type UpdateUserType = Omit<CreateUserType, 'username'>;
