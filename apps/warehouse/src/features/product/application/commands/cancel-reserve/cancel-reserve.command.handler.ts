import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CancelReserveProductCommand } from './cancel-reserve.command';
import { Logger } from '@nestjs/common';
import { ProductRepository } from '../../../infrastructure/repository';

@CommandHandler(CancelReserveProductCommand)
export class CancelReserveProductCommandHandler
  implements ICommandHandler<CancelReserveProductCommand, void>
{
  private logger = new Logger(CancelReserveProductCommandHandler.name);
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    cancelReserveProduct: { orderId, transactionId },
  }: CancelReserveProductCommand): Promise<void> {
    const ids = [];
    const products = await this.productRepository.getAllByOrderId(
      orderId,
      transactionId,
    );
    if (!products.length) return;
    products.forEach((product) => {
      product.quantity += 1;
      const idr = product.reservedProducts.find((r) => r.orderId === orderId);
      ids.push(idr.id);
    });
    await this.productRepository.saveMany(products);
    if (ids.length) await this.productRepository.deleteReservedProduct(ids);
  }
}
