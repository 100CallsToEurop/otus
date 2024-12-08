import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AllExceptionsFilter } from '@app/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { AppController } from './app.controller';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MetricsMiddleware } from '@app/common/middlewares';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from '@app/common/guards';
import { AtStrategy } from '@app/common/strategies';
import { SecurityDeviceModule } from './security-device/security-device.module';
import { KafkaConfigService } from '@app/providers/kafka/config';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    UserModule,
    AuthModule,
    SecurityDeviceModule,
  ],
  controllers: [AppController],
  providers: [
    KafkaConfigService,
    AtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
