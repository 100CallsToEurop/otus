import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEntity } from './domain';
import { OutboxFacade, outboxFacadeFactory } from './application';
import { OUTBOX_COMMAND_HANDLERS } from './application/commands';
import { OutboxAdapter } from './infrastructure/adapter';
import { OutboxRepository } from './infrastructure/repository';
import { AmqpModule } from '@app/providers/amqp';

@Module({
  imports: [
    CqrsModule,
    AmqpModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([OutboxEntity]),
  ],
  providers: [
    ...OUTBOX_COMMAND_HANDLERS,
    {
      provide: OutboxFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: outboxFacadeFactory,
    },
    {
      provide: OutboxRepository,
      useClass: OutboxAdapter,
    },
  ],
  exports: [],
})
export class OutboxModule {}
