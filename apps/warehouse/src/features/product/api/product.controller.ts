import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductFacade } from '../application';
import { CreateProductDto } from './models/input';
import { ProductViewModel } from './models/views';
import { Roles } from '@app/common/decorators';
import { ROLE } from '@app/consts';

@Controller('products')
export class ProductController {
  constructor(private readonly productFacade: ProductFacade) {}
  @Roles(ROLE.MANAGER)
  @Post()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<{ productId: number }> {
    return this.productFacade.commands.createProduct(createProductDto);
  }
  @Roles(ROLE.MANAGER, ROLE.USER)
  @Get()
  async getProducts(): Promise<ProductViewModel[]> {
    return this.productFacade.queries.getAllProducts();
  }
}
