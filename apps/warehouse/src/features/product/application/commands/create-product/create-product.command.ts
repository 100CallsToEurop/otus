import { CreateProductDto } from './create-product.dto';

export class CreateProductCommand {
  constructor(public createProductDto: CreateProductDto) {}
}
