import { Module } from '@nestjs/common';
import { ProductController } from './api/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './domain/product.entity';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { PRODUCT_QUERY_HANDLERS } from './application/queries';
import { ProductFacade, productFacadeFactory } from './application';
import { PRODUCT_COMMAND_HANDLERS } from './application/commands';
import { ProductAdapter } from './infrastructure/adapter';
import { ProductRepository } from './infrastructure/repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProductEntity])],
  controllers: [ProductController],
  providers: [
    ...PRODUCT_COMMAND_HANDLERS,
    ...PRODUCT_QUERY_HANDLERS,
    {
      provide: ProductFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: productFacadeFactory,
    },
    {
      provide: ProductRepository,
      useClass: ProductAdapter,
    },
  ],
  exports: [ProductRepository],
})
export class ProductModule {}
