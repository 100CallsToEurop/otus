import { Injectable, Logger } from '@nestjs/common';
import { ISecurityDevice, SecurityDeviceEntity } from '../../domain';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SecurityDevicesRepository } from '../repository';

@Injectable()
export class SecurityDevicesAdapter implements SecurityDevicesRepository {
  readonly logger: Logger = new Logger(SecurityDevicesAdapter.name);

  constructor(
    @InjectRepository(SecurityDeviceEntity)
    private readonly securityDeviceRepository: Repository<SecurityDeviceEntity>,
  ) {}

  async save(device: ISecurityDevice): Promise<ISecurityDevice> {
    return await this.securityDeviceRepository.save(device);
  }

  async deleteAllByUser(userId: number, deviceId: string): Promise<void> {
    await this.securityDeviceRepository.delete({
      userId,
      deviceId: Not(deviceId),
    });
  }

  async deleteByDeviceId(deviceId: string, userId?: number): Promise<void> {
    await this.securityDeviceRepository.delete({
      deviceId,
      userId,
    });
  }

  async getCurrentDevice(
    userId: number,
    deviceId: string,
  ): Promise<ISecurityDevice> {
    return await this.securityDeviceRepository.findOneBy({
      deviceId,
      userId,
    });
  }

  async getAllUserDevice(userId: number): Promise<[ISecurityDevice[], number]> {
    return await this.securityDeviceRepository.findAndCount({
      where: { userId },
    });
  }
}
