export type LoginDto = {
  readonly userId: number;
  readonly ip: string;
  readonly user_agent: string;
  readonly deviceId?: string;
};
