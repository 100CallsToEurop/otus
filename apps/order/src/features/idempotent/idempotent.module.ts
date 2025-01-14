import { Module } from '@nestjs/common';
import { IdempotentFacade, idempotentFacadeFactory } from './application';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdempotentEntity } from './domain';
import { IDEMPOTENT_COMMAND_HANDLERS } from './application/commands';
import { IDEMPOTENT_QUERY_HANDLERS } from './application/queries';
import { IdempotentAdapter } from './infrastructure/adapter';
import { IdempotentRepository } from './infrastructure/repository';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([IdempotentEntity])],
  controllers: [],
  providers: [
    ...IDEMPOTENT_COMMAND_HANDLERS,
    ...IDEMPOTENT_QUERY_HANDLERS,
    {
      provide: IdempotentFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: idempotentFacadeFactory,
    },
    {
      provide: IdempotentRepository,
      useClass: IdempotentAdapter,
    },
  ],
  exports: [IdempotentFacade],
})
export class IdempotentModule {}
