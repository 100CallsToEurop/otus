export class LoginUserEvent {
  constructor(
    public userId: number,
    public deviceId: string,
    public ip: string,
    public user_agent: string,
    public exp: string,
    public iat: string,
  ) {}
}
