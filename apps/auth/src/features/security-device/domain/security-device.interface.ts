export interface ISecurityDevice {
  id: number;
  iat: string;
  exp: string;
  deviceId: string;
  ip: string;
  user_agent: string;
  userId: number;

  update(event: Partial<ISecurityDevice>): void;
  plainToInstance(): void;
}
