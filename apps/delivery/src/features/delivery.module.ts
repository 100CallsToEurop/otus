import { Module } from '@nestjs/common';
import { CourierModule } from './courier/courier.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllExceptionsFilter } from '@app/common';
import { JwtAuthGuard, RolesGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { TypeOrmConfigService } from '../db/config';
import { OutboxModule } from '@app/outbox';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/delivery/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    CourierModule,
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
export class DeliveryModule {}
