import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderUserEntity } from './domain';
import { AmqpModule } from '@app/providers/amqp';
import { UserEventController } from './api';
import { OrderUserFacade, orderUserFacadeFactory } from './application';
import { ORDER_USER_COMMAND_HANDLERS } from './application/commands';
import { ORDER_USER_EVENT_HANDLERS } from './application/events';
import { OrderUserAdapter } from './infrastructure/adapter';
import { OrderUserRepository } from './infrastructure/repository';
import { IdempotencyModule } from '@app/idempotency';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OrderUserEntity]),
    AmqpModule,
    IdempotencyModule,
  ],
  controllers: [UserEventController],
  providers: [
    ...ORDER_USER_COMMAND_HANDLERS,
    ...ORDER_USER_EVENT_HANDLERS,
    {
      provide: OrderUserFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: orderUserFacadeFactory,
    },
    {
      provide: OrderUserRepository,
      useClass: OrderUserAdapter,
    },
  ],
  exports: [OrderUserRepository],
})
export class OrderUserModule {}
