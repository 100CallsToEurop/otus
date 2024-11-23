import { randomUUID } from 'crypto';
import { LoginDto } from './login.dto';

export class LoginUserCommand {
  userId: number;
  ip: string;
  user_agent: string;
  deviceId: string;
  groupId: string;

  constructor(device: LoginDto) {
    this.userId = device.userId;
    this.ip = device.ip;
    this.user_agent = device.user_agent;
    this.deviceId = device.deviceId ?? randomUUID();
  }
}
