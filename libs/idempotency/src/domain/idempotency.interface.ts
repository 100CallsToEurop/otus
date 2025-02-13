export interface IIdempotency {
  id: number;
  eventId: string;

  plainToInstance(): void;
}
