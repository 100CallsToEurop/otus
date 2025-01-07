import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CreateOrderCommand } from './create-order.command';
import { OrderRepository } from '../../../infrastructure/repository';
import { OrderEntity } from '../../../domain';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PlaceOrderSaga } from '../../sagas/place-order';
import { SaveViewOrderEvent } from '../../../domain/events';

@CommandHandler(CreateOrderCommand)
export class CreateOrderCommandHandler
  implements ICommandHandler<CreateOrderCommand, { orderId: number }>
{
  constructor(
    private readonly eventBus: EventBus,
    private readonly amqpConnection: AmqpConnection,
    private readonly orderRepository: OrderRepository,
  ) {}

  async execute({
    orderDto: { userId, itemsIds, totalPrice, deliveryDate },
  }: CreateOrderCommand): Promise<{ orderId: number }> {
    const newOrder = OrderEntity.create(userId, totalPrice, deliveryDate);
    newOrder.addItemsIds(itemsIds);
    const saga = new PlaceOrderSaga(newOrder, this.amqpConnection);
    const order = await saga.getState().started();
    await this.orderRepository.save(order);
    await this.eventBus.publish(new SaveViewOrderEvent(order));
    return { orderId: newOrder.id };
  }
}
