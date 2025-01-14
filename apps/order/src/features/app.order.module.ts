import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { AllExceptionsFilter } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { OrderModule } from './order/order.module';
import { IdempotentModule } from './idempotent/idempotent.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/order/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    OrderModule,
    IdempotentModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppOrderModule {}
