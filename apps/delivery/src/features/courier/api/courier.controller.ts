import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourierFacade } from '../application';
import { CreateCourierInputModel } from './model/input';
import { CourierViewModel } from './model/view';

@Controller('couriers')
export class CourierController {
  constructor(private readonly courierFacade: CourierFacade) {}

  @Post()
  async createCourier(
    @Body() createCourier: CreateCourierInputModel,
  ): Promise<{ courierId: number }> {
    return await this.courierFacade.commands.create(createCourier);
  }

  @Get()
  async getCourier(): Promise<CourierViewModel[]> {
    return this.courierFacade.queries.getAllCouriers();
  }
}
