import { Module } from '@nestjs/common';
import { ProductController } from './api/product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './domain/product/product.entity';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { PRODUCT_QUERY_HANDLERS } from './application/queries';
import { ProductFacade, productFacadeFactory } from './application';
import { PRODUCT_COMMAND_HANDLERS } from './application/commands';
import { ProductAdapter } from './infrastructure/adapter';
import { ProductRepository } from './infrastructure/repository';
import { ReservedProductEntity } from './domain/reserved-product';
import { PRODUCT_EVENT_HANDLERS } from './application/events';
import { ProductEventController } from './api';
import { AmqpModule } from '@app/providers/amqp';
import { IdempotencyModule } from '@app/idempotency';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([ProductEntity, ReservedProductEntity]),
    AmqpModule,
    IdempotencyModule,
  ],
  controllers: [ProductController, ProductEventController],
  providers: [
    ...PRODUCT_COMMAND_HANDLERS,
    ...PRODUCT_EVENT_HANDLERS,
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
