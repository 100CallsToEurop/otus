import { ISecurityDevice } from '../../domain';

export abstract class SecurityDevicesRepository {
  abstract save(device: ISecurityDevice): Promise<ISecurityDevice>;
  abstract getCurrentDevice(
    userId: number,
    deviceId: string,
  ): Promise<ISecurityDevice>;
  abstract getAllUserDevice(
    userId: number,
  ): Promise<[ISecurityDevice[], number]>;
  abstract deleteAllByUser(userId: number, deviceId: string): Promise<void>;
  abstract deleteByDeviceId(deviceId: string, userId?: number): Promise<void>;
}
