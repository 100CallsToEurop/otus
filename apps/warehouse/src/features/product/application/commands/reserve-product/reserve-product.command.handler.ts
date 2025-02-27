import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReserveProductCommand } from './reserve-product.command';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../../../infrastructure/repository';
import { FailReservedProductEvent } from '../../../domain/events';
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
    eventId,
    reserveProduct: { orderId, transactionId, itemsIds },
  }: ReserveProductCommand): Promise<void> {
    this.logger.log(`резервация продуктов orderId: ${orderId}`);
    const products = await this.productRepository.getAll(itemsIds);
    if (!products.length) {
      this.eventBus.publish(
        new FailReservedProductEvent(orderId, transactionId),
      );
      await this.productRepository.saveManyProducts(eventId, products);
      return;
    }
    const allReservedSuccessfully = products.every((product) => {
      const reservationSuccessful = product.addReservedProduct(
        orderId,
        transactionId,
      );
      if (!reservationSuccessful) return false;
      return true;
    });

    await sleep(1000);

    if (!allReservedSuccessfully) {
      await this.eventBus.publish(
        new FailReservedProductEvent(orderId, transactionId),
      );
      await this.productRepository.saveManyProducts(eventId, products);
      return;
    }


    await this.productRepository.reserveProducts(
      eventId,
      orderId,
      transactionId,
      products,
    );
  }
}
