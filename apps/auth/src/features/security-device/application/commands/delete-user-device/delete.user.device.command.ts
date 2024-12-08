export class DeleteUserDeviceCommand {
  constructor(
    public userId: number,
    public deviceId: string,
    public deleteDeviceId: string,
  ) {}
}
