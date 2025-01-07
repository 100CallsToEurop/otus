import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllCouriersQuery } from './get-all-couriers.query';
import { CourierRepository } from '../../../infrastructure/repository';
import { CourierResponse } from '../../../domain/courier';

@QueryHandler(GetAllCouriersQuery)
export class GetAllCouriersQueryHandler
  implements IQueryHandler<GetAllCouriersQuery, CourierResponse[]>
{
  constructor(private readonly courierRepository: CourierRepository) {}
  async execute(): Promise<CourierResponse[]> {
    const couriers = await this.courierRepository.getAllCouriers();
    return couriers.map((courier) => new CourierResponse(courier));
  }
}
