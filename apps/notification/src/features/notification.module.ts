import { AllExceptionsFilter } from '@app/common';
import { KafkaConfigService } from '@app/providers/kafka/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from '../db/config';
import { MessageModule } from './message/message.module';
import { JwtAuthGuard } from '@app/common/guards';
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
    KafkaConfigService,
    JwtStrategy,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class NotificationModule {}
