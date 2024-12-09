import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Put,
  Req,
} from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { UserViewModel } from './models/views';
import { AddFundsDto } from './models/input';
import { Request } from 'express';

@Controller('billings')
export class BillingController {
  constructor(private readonly billingFacade: UserBillingFacade) {}

  @HttpCode(204)
  @Put(':userId/add-funds')
  async addFunds(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() { amount }: AddFundsDto,
  ): Promise<{ userId: number }> {
    return this.billingFacade.commands.addFunds(userId, amount);
  }

  @Get(':userId')
  async getUserInfo(
    @Param('userId', ParseIntPipe) userId: number,
    @Req() request: Request,
  ): Promise<UserViewModel> {
    console.log(request);
    return this.billingFacade.queries.getUserInfo(userId);
  }
}
