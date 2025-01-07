import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../../../infrastructure/repository';
import { ProductEntity } from '../../../domain/product';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler
  implements ICommandHandler<CreateProductCommand, { productId: number }>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute({
    createProductDto,
  }: CreateProductCommand): Promise<{ productId: number }> {
    const newProduct = ProductEntity.create(createProductDto);
    const checkProduct = await this.productRepository.getByName(
      createProductDto.name,
    );
    if (checkProduct) {
      throw new BadRequestException('Product already exists');
    }
    const product = await this.productRepository.save(newProduct);
    return { productId: product.id };
  }
}
