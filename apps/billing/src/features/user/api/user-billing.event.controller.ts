import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { UserBillingFacade } from '../application';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

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
  async createUser(payload: any): Promise<void> {
    await this.productFacade.commands.createUser(JSON.parse(payload));
  }

  @EventPattern('deduct-funds')
  async deductFunds(payload: any): Promise<void> {
    await this.productFacade.commands.deductFunds(JSON.parse(payload));
  }
}
