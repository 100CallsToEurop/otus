import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { UserViewModel } from './models/views';
import { AddFundsDto } from './models/input';
import { Roles } from '@app/common/decorators';
import { ROLE } from '@app/consts';

@Controller('billings')
export class BillingController {
  constructor(private readonly billingFacade: UserBillingFacade) {}
  @Roles(ROLE.USER)
  @HttpCode(204)
  @Put(':userId/add-funds')
  async addFunds(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() { amount }: AddFundsDto,
  ): Promise<{ userId: number }> {
    return await this.billingFacade.commands.addFunds(userId, amount);
  }

  @Roles(ROLE.USER)
  @Get(':userId')
  async getUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserViewModel> {
    return await this.billingFacade.queries.getUserInfo(userId);
  }
}
