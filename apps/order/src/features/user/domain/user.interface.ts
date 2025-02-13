export interface IOrderUser {
  id: number;
  email: string;
  fullName: string;

  plainToInstance(): void;
}
