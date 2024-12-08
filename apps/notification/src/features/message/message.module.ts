import { Module } from '@nestjs/common';
import { CqrsModule, CommandBus, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageController, MessageEventController } from './api';
import { MessageFacade, messageFacadeFactory } from './application';
import { MESSAGE_COMMAND_HANDLERS } from './application/commands';
import { MESSAGE_QUERY_HANDLERS } from './application/queries';
import { MessageEntity } from './domain';
import { MessageAdapter } from './infrastructure/adapter';
import { MessageRepository } from './infrastructure/repository';
import { clientConfig } from '@app/providers/kafka/config';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.registerAsync([clientConfig()]),
    CqrsModule,
    TypeOrmModule.forFeature([MessageEntity]),
  ],
  controllers: [MessageController, MessageEventController],
  providers: [
    ...MESSAGE_COMMAND_HANDLERS,
    ...MESSAGE_QUERY_HANDLERS,
    {
      provide: MessageFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: messageFacadeFactory,
    },
    {
      provide: MessageRepository,
      useClass: MessageAdapter,
    },
  ],
  exports: [],
})
export class MessageModule {}
