import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { CreateUserDto, DeductFundsDto } from './models/input';

@Controller()
export class BillingEventController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly productFacade: UserBillingFacade,
  ) {}

  onModuleInit() {
    const requestPatterns = ['user-created', 'deduct-funds'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @EventPattern('user-created')
  async createUser(@Payload() payload: CreateUserDto): Promise<void> {
    await this.productFacade.commands.createUser(payload);
  }

  @EventPattern('deduct-funds')
  async deductFunds(@Payload() payload: DeductFundsDto): Promise<void> {
    await this.productFacade.commands.deductFunds(payload);
  }
}
