import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { AllExceptionsFilter, MetricsMiddleware } from '@app/common';
import { JwtAuthGuard, RolesGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { OutboxModule } from '@app/outbox';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    ConfigModule.forRoot({
      envFilePath: './apps/warehouse/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    ProductModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class WarehouseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}
