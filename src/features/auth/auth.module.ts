import { Module } from '@nestjs/common';
import { RtStrategy } from '@app/common/strategies/jwt.refresh.strategy';
import { CqrsModule, CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthFacade, authFacadeFactory } from './application';
import { AUTH_COMMAND_HANDLERS } from './application/commands';
import { TokensService } from './application/services';
import { BadTokensAdapter } from './infrastructure/adapter';
import { BadTokenRepository } from './infrastructure/repository';
import { UserModule } from '../user/user.module';
import { AuthController } from './api';
import { BadTokenEntity } from './domain';
import { SecurityDeviceModule } from '../security-device/security-device.module';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([BadTokenEntity]),
    UserModule,
    SecurityDeviceModule,
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    {
      provide: AuthFacade,
      inject: [CommandBus, QueryBus],
      useFactory: authFacadeFactory,
    },
    RtStrategy,
    {
      provide: BadTokenRepository,
      useClass: BadTokensAdapter,
    },
    TokensService,
  ],
  exports: [AuthFacade],
})
export class AuthModule {}
