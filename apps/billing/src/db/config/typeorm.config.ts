import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { WalletEntity } from '../../features/billing/domain/wallet';
import { BillingEntity } from '../../features/billing/domain/billing';
import { HistoryEntity } from '../../features/billing/domain/history';
import { OutboxEntity } from '@app/outbox/domain';
import { IdempotencyEntity } from '@app/idempotency/domain';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [
      BillingEntity,
      WalletEntity,
      HistoryEntity,
      OutboxEntity,
      IdempotencyEntity,
    ],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
