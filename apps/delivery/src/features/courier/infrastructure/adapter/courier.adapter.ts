import { Injectable, Logger } from '@nestjs/common';
import { CourierRepository } from '../repository';
import { CourierEntity, ICourier } from '../../domain/courier';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, Not, Repository } from 'typeorm';

@Injectable()
export class CourierAdapter implements CourierRepository {
  private readonly logger = new Logger(CourierAdapter.name);

  constructor(
    @InjectRepository(CourierEntity)
    private readonly courierRepository: Repository<CourierEntity>,
  ) {}
  async save(courier: ICourier): Promise<ICourier> {
    return await this.courierRepository.save(courier);
  }
  async getFreeCourier(checkDate: Date): Promise<ICourier | null> {
    const cd = new Date(checkDate);
    const startOfDay = new Date(cd.getFullYear(), cd.getMonth(), cd.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 86400000 - 1);

    const freeCouriers = await this.courierRepository.find({
      where: {
        availabilitySlots: [
          {
            id: IsNull(),
          },
          {
            date: Not(Between(startOfDay, endOfDay)),
          },
        ],
      },
      relations: { availabilitySlots: true },
    });
    if (!freeCouriers.length) return null;
    return freeCouriers[0];
  }
  async getCourierByOrderId(
    orderId: number,
    transactionId: string,
  ): Promise<ICourier | null> {
    return await this.courierRepository.findOne({
      where: {
        availabilitySlots: {
          orderId,
          transactionId,
        },
      },
      relations: { availabilitySlots: true },
    });
  }

  async getAllCouriers(): Promise<ICourier[]> {
    return await this.courierRepository.find({
      relations: { availabilitySlots: true },
    });
  }
}
