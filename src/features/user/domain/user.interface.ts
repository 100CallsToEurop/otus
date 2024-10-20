export interface IUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  update(user: Partial<IUser>): void;
  plainToInstance(): void;
}
