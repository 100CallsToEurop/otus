export interface IBadToken {
  id: number;
  token: string;

  plainToInstance(): void;
}
