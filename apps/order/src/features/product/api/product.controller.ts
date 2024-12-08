import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductFacade } from '../application';
import { CreateProductDto } from './models/input';
import { ProductViewModel } from './models/views';

@Controller('products')
export class ProductController {
  constructor(private readonly productFacade: ProductFacade) {}

  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ productId: number }> {
    return this.productFacade.commands.createProduct(createProductDto);
  }

  @Get()
  async getProducts(): Promise<ProductViewModel[]> {
    return this.productFacade.queries.getAllProducts();
  }
}
