export interface IIdempotent {
  id: string;

  plainToInstance(): void;
}
