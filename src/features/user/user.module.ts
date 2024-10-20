import { Module } from '@nestjs/common';
import { UserController } from './api/user.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './domain';
import { USER_COMMAND_HANDLERS } from './application/commands';
import { USER_QUERY_HANDLERS } from './application/queries';
import { UserRepository } from './infrastructure/repository';
import { UserAdapter } from './infrastructure/adapter';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    ...USER_COMMAND_HANDLERS,
    ...USER_QUERY_HANDLERS,
    {
      provide: UserRepository,
      useClass: UserAdapter,
    },
  ],
})
export class UserModule {}
