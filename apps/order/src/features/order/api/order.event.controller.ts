import { Controller, Inject, OnModuleInit } from '@nestjs/common';
import { OrderFacade } from '../application';
import { ClientKafka, EventPattern, Payload } from '@nestjs/microservices';
import { PaymentConfirmationDto } from './models/input';

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
  async PaymentConfirmation(@Payload() payload: PaymentConfirmationDto) {
    await this.orderFacade.commands.paymentConfirmation(payload);
  }
}
