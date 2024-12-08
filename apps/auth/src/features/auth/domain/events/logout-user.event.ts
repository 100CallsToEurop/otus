export class LogoutUserEvent {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}
