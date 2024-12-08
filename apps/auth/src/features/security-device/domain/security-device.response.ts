import { ISecurityDevice } from './security-device.interface';

export class SecurityDeviceResponse {
  ip: string;
  title: string;
  lastActiveDate: string;
  deviceId: string;

  constructor(device: ISecurityDevice) {
    this.ip = device.ip ?? '';
    this.title = device.user_agent ?? '';
    this.lastActiveDate = new Date(+device.iat * 1000).toISOString();
    this.deviceId = device.deviceId;
  }
}
