import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { ReserveProductCommand } from './reserve-product.command';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../../../infrastructure/repository';
import { FailReservedEvent } from '../../../domain/events';
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
    reserveProduct: { orderId, transactionId, itemsIds },
  }: ReserveProductCommand): Promise<void> {
    this.logger.log(`резервация продуктов orderId: ${orderId}`);
    const products = await this.productRepository.getAll(itemsIds);
    if (!products.length) {
      await this.eventBus.publish(
        new FailReservedEvent(orderId, transactionId),
      );
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
        new FailReservedEvent(orderId, transactionId),
      );
      return;
    }

    await this.productRepository.reserveProducts(
      orderId,
      transactionId,
      products,
    );
  }
}
