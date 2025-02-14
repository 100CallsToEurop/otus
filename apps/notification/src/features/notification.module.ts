import { AllExceptionsFilter } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { MessageModule } from './message/message.module';
import { RolesGuard } from '@app/common/guards';
import { JwtStrategy } from '@app/common/strategies';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/notification/.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(TypeOrmConfigService()),
    MessageModule,
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    { provide: APP_GUARD, useClass: RolesGuard },
    // { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class NotificationModule {}
