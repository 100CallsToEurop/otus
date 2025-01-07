import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelReserveCourierCommand } from './cancel-reserve.command';
import { Logger } from '@nestjs/common';
import { CourierRepository } from '../../../infrastructure/repository';

@CommandHandler(CancelReserveCourierCommand)
export class CancelReserveCourierCommandHandler
  implements ICommandHandler<CancelReserveCourierCommand, void>
{
  private logger = new Logger(CancelReserveCourierCommandHandler.name);
  constructor(private readonly courierRepository: CourierRepository) {}

  async execute({
    cancelReserveCourier: { orderId },
  }: CancelReserveCourierCommand): Promise<void> {
    const courier = await this.courierRepository.getCourierByOrderId(orderId);
    if (!courier) return;
    courier.deleteSlot(orderId);
    await this.courierRepository.save(courier);
  }
}
