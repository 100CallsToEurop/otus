import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { OrderFacade } from '../application';
import { ClientKafka, EventPattern } from '@nestjs/microservices';

@Controller()
export class OrderEventController implements OnModuleInit {
  constructor(
    @Inject('KAFKA_SERVICE') private readonly client: ClientKafka,
    private readonly orderFacade: OrderFacade,
  ) {}

  onModuleInit() {
    const requestPatterns = ['payment-confirmation'];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  @EventPattern('payment-confirmation')
  async PaymentConfirmation(payload: any) {
    await this.orderFacade.commands.paymentConfirmation(JSON.parse(payload));
  }
}
