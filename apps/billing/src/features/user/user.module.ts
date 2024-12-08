import { clientConfig } from '@app/providers/kafka/config';
import { Module } from '@nestjs/common';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingController, BillingEventController } from './api';
import { UserEntity } from './domain/user';
import { WalletEntity } from './domain/wallet';
import { UserBillingFacade, userBillingFacadeFactory } from './application';
import { BILLING_COMMAND_HANDLERS } from './application/commands';
import { BILLING_EVENT_HANDLERS } from './application/events';
import { BILLING_QUERY_HANDLERS } from './application/queries';
import { UserAdapter } from './infrastructure/adapter';
import { UserRepository } from './infrastructure/repository';

@Module({
  imports: [
    ClientsModule.registerAsync([clientConfig()]),
    CqrsModule,
    TypeOrmModule.forFeature([UserEntity, WalletEntity]),
  ],
  controllers: [BillingController, BillingEventController],
  providers: [
    ...BILLING_COMMAND_HANDLERS,
    ...BILLING_EVENT_HANDLERS,
    ...BILLING_QUERY_HANDLERS,
    {
      provide: UserBillingFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: userBillingFacadeFactory,
    },
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
  ],
})
export class UserModule {}
