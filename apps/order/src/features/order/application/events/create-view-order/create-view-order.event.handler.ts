import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SaveViewOrderEvent } from '../../../domain/events';
import { OrderViewRepository } from '../../../infrastructure/repository';
import { OrderViewEntity } from '../../../domain/view';

@EventsHandler(SaveViewOrderEvent)
export class CreateViewOrderEventHandler
  implements IEventHandler<SaveViewOrderEvent>
{
  constructor(private readonly orderViewRepository: OrderViewRepository) {}
  async handle({ order }: SaveViewOrderEvent) {
    const newViewOrder = OrderViewEntity.create(order);
    await this.orderViewRepository.save(newViewOrder);
  }
}
