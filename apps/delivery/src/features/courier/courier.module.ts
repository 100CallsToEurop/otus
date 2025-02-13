import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourierEntity } from './domain/courier';
import { AvailabilitySlotEntity } from './domain/availability-slot';
import { AmqpModule } from '@app/providers/amqp';
import { CourierController, CourierEventController } from './api';
import { CourierFacade, courierFacadeFactory } from './application';
import { CourierAdapter } from './infrastructure/adapter';
import { CourierRepository } from './infrastructure/repository';
import { COURIER_COMMAND_HANDLERS } from './application/commands';
import { COURIER_EVENT_HANDLERS } from './application/events';
import { COURIER_QUERY_HANDLERS } from './application/queries';
import { IdempotencyModule } from '@app/idempotency';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([CourierEntity, AvailabilitySlotEntity]),
    AmqpModule,
    IdempotencyModule,
  ],
  controllers: [CourierController, CourierEventController],
  providers: [
    ...COURIER_COMMAND_HANDLERS,
    ...COURIER_EVENT_HANDLERS,
    ...COURIER_QUERY_HANDLERS,
    {
      provide: CourierFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: courierFacadeFactory,
    },
    {
      provide: CourierRepository,
      useClass: CourierAdapter,
    },
  ],
  exports: [],
})
export class CourierModule {}
