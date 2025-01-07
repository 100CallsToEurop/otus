import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReserveProductCommand } from './reserve-product.command';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../../../infrastructure/repository';
import { ReservedEvent } from '../../../domain/events';
import { sleep } from '@app/utils';

@CommandHandler(ReserveProductCommand)
export class ReserveProductCommandHandler
  implements ICommandHandler<ReserveProductCommand, void>
{
  private logger = new Logger(ReserveProductCommandHandler.name);
  constructor(
    private readonly eventBus: EventBus,
    private readonly productRepository: ProductRepository,
  ) {}

  async execute({
    reserveProduct: { orderId, itemsIds },
  }: ReserveProductCommand): Promise<void> {
    const products = await this.productRepository.getAll(itemsIds);
    if (!products.length) {
      await this.eventBus.publish(new ReservedEvent(orderId, false, []));
      return;
    }
    const allReservedSuccessfully = products.every((product) => {
      const reservationSuccessful = product.addReservedProduct(orderId);
      if (!reservationSuccessful) return false;
      return true;
    });

    await sleep(1000);

    if (!allReservedSuccessfully) {
      await this.eventBus.publish(new ReservedEvent(orderId, false, []));
      return;
    }

    await this.productRepository.saveMany(products);
    await this.eventBus.publish(new ReservedEvent(orderId, true, products));
  }
}
