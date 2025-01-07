import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReserveCourierCommand } from './reserve-courier.command';
import { Logger } from '@nestjs/common';
import { CourierRepository } from '../../../infrastructure/repository';
import { ReservedEvent } from '../../../domain/events';
import { sleep } from '@app/utils';

@CommandHandler(ReserveCourierCommand)
export class ReserveCourierCommandHandler
  implements ICommandHandler<ReserveCourierCommand, void>
{
  private logger = new Logger(ReserveCourierCommandHandler.name);
  constructor(
    private readonly eventBus: EventBus,
    private readonly courierRepository: CourierRepository,
  ) {}

  async execute({
    reserveCourier: { orderId, deliveryDate },
  }: ReserveCourierCommand): Promise<void> {
    const courier = await this.courierRepository.getFreeCourier(deliveryDate);

    await sleep(1000);

    if (!courier) {
      await this.eventBus.publish(new ReservedEvent(orderId, false));
      return;
    }
    courier.addSlot(orderId, deliveryDate);
    courier.plainToInstance();
    await this.courierRepository.save(courier);
    await this.eventBus.publish(
      new ReservedEvent(orderId, true, courier.fullName),
    );
  }
}
