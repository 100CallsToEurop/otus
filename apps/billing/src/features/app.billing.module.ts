import { AllExceptionsFilter } from '@app/common';
import { JwtAuthGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { BillingModule } from './user/billing.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/billing/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    BillingModule,
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
export class AppBillingModule {}
