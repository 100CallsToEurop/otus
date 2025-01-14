import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { OrderViewRepository } from '../../../infrastructure/repository';
import { UpdateViewOrderStatusEvent } from '../../../domain/events';

@EventsHandler(UpdateViewOrderStatusEvent)
export class UpdateViewOrderEventHandler
  implements IEventHandler<UpdateViewOrderStatusEvent>
{
  constructor(private readonly orderViewRepository: OrderViewRepository) {}

  async handle({
    orderId,
    transactionId,
    status,
  }: UpdateViewOrderStatusEvent): Promise<void> {
    const order = await this.orderViewRepository.getOrderForUpdate(
      orderId,
      transactionId,
    );
    order.status = status;
    order.plainToInstance();
    await this.orderViewRepository.save(order);
  }
}
