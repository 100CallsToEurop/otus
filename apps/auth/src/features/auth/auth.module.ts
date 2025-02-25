import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RtStrategy } from '@app/common/strategies/jwt.refresh.strategy';
import { CqrsModule, CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';
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
import { AUTH_EVENT_HANDLERS } from './application/events';
import { AtStrategy } from '@app/common/strategies';
import { AmqpModule } from '@app/providers/amqp';
import { MetricsMiddleware } from '@app/common';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([BadTokenEntity]),
    UserModule,
    SecurityDeviceModule,
    JwtModule,
    AmqpModule,
  ],
  controllers: [AuthController],
  providers: [
    ...AUTH_COMMAND_HANDLERS,
    ...AUTH_EVENT_HANDLERS,
    {
      provide: AuthFacade,
      inject: [CommandBus, EventBus, QueryBus],
      useFactory: authFacadeFactory,
    },
    AtStrategy,
    RtStrategy,
    {
      provide: BadTokenRepository,
      useClass: BadTokensAdapter,
    },
    TokensService,
  ],
  exports: [AuthFacade],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
