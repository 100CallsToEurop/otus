import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { AllExceptionsFilter } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ProductModule } from './product/product.module';
import { OutboxModule } from '@app/outbox';

@Module({
  imports: [
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
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class WarehouseModule {}
