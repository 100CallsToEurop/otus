export class DeleteAllUserDevicesCommand {
  constructor(
    public userId: number,
    public deviceId: string,
  ) {}
}
