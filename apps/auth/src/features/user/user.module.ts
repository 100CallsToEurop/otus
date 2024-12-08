import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { CommandBus, CqrsModule, EventBus, QueryBus } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain/user';
import { USER_COMMAND_HANDLERS } from './application/commands';
import { USER_QUERY_HANDLERS } from './application/queries';
import { UserRepository } from './infrastructure/repository';
import { UserAdapter } from './infrastructure/adapter';
import { ProfileEntity } from './domain/profile';
import { UserFacade, userFacadeFactory } from './application';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity, ProfileEntity])],
  controllers: [UserController],
  providers: [
    ...USER_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    {
      provide: UserFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: userFacadeFactory,
    },
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
  ],
  exports: [UserRepository],
})
export class UserModule {}
