import { Body, Controller, Get, Post } from '@nestjs/common';
import { CourierFacade } from '../application';
import { CreateCourierInputModel } from './model/input';
import { CourierViewModel } from './model/view';
import { Roles } from '@app/common/decorators';
import { ROLE } from '@app/consts';

@Controller('couriers')
export class CourierController {
  constructor(private readonly courierFacade: CourierFacade) {}
  @Roles(ROLE.MANAGER)
  @Post()
  async createCourier(
    @Body() createCourier: CreateCourierInputModel,
  ): Promise<{ courierId: number }> {
    return await this.courierFacade.commands.create(createCourier);
  }
  @Roles(ROLE.MANAGER)
  @Get()
  async getCourier(): Promise<CourierViewModel[]> {
    return this.courierFacade.queries.getAllCouriers();
  }
}
