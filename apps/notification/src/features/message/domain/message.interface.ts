export interface IMessage {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;

  plainToInstance(): void;
}
