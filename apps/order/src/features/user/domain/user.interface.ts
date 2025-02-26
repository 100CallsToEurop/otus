export interface IOrderUser {
  id: number;
  email: string;
  fullName: string;

  update(user: Partial<IOrderUser>): void;
  plainToInstance(): void;
}
