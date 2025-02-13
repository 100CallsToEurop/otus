import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReserveCourierCommand } from './reserve-courier.command';
import { Logger } from '@nestjs/common';
import { CourierRepository } from '../../../infrastructure/repository';
import { sleep } from '@app/utils';
import { FailReservedEvent } from '../../../domain/events';

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
    reserveCourier: { orderId, transactionId, deliveryDate },
  }: ReserveCourierCommand): Promise<void> {
    this.logger.log(`резервация курьера orderId: ${orderId}`);
    const courier = await this.courierRepository.getFreeCourier(deliveryDate);

    await sleep(1000);

    if (!courier) {
      await this.eventBus.publish(
        new FailReservedEvent(orderId, transactionId),
      );
      return;
    }
    courier.addSlot(orderId, transactionId, deliveryDate);
    courier.plainToInstance();
    await this.courierRepository.reserveCourier(
      orderId,
      transactionId,
      courier,
    );
  }
}
