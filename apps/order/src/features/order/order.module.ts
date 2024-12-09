import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './domain';
import { ProductModule } from '../product/product.module';
import { OrderController, OrderEventController } from './api';
import { OrderFacade, orderFacadeFactory } from './application';
import { ORDER_COMMAND_HANDLERS } from './application/commands';
import { ORDER_QUERY_HANDLERS } from './application/queries';
import { OrderAdapter } from './infrastructure/adapter';
import { OrderRepository } from './infrastructure/repository';
import { ClientsModule } from '@nestjs/microservices';
import { clientConfig } from '@app/providers/kafka/config';
import { ORDER_EVENT_HANDLERS } from './application/events';

@Module({
  imports: [
    ClientsModule.registerAsync([clientConfig()]),
    CqrsModule,
    TypeOrmModule.forFeature([OrderEntity]),
    ProductModule,
  ],
  controllers: [OrderController, OrderEventController],
  providers: [
    ...ORDER_COMMAND_HANDLERS,
    ...ORDER_EVENT_HANDLERS,
    ...ORDER_QUERY_HANDLERS,
    {
      provide: OrderFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: orderFacadeFactory,
    },
    {
      provide: OrderRepository,
      useClass: OrderAdapter,
    },
  ],
  exports: [],
})
export class OrderModule {}
