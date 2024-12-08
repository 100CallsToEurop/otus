import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUserDevicesQuery } from './get-all-user-devices.query';
import { NotFoundException } from '@nestjs/common';
import { SecurityDeviceResponse } from '../../../domain';
import { SecurityDevicesRepository } from '../../../infrastructure/repository';

@QueryHandler(GetAllUserDevicesQuery)
export class GetAllUserDevicesQueryHandler
  implements IQueryHandler<GetAllUserDevicesQuery, SecurityDeviceResponse[]>
{
  constructor(
    private readonly securityDevicesRepository: SecurityDevicesRepository,
  ) {}

  async execute({
    userId,
  }: GetAllUserDevicesQuery): Promise<SecurityDeviceResponse[]> {
    const [devices, count] =
      await this.securityDevicesRepository.getAllUserDevice(userId);
    if (!count) {
      throw new NotFoundException();
    }
    return devices.map((device) => new SecurityDeviceResponse(device));
  }
}
