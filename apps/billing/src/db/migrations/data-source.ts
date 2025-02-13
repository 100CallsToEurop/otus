import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { WalletEntity } from '../../features/billing/domain/wallet';
import { BillingEntity } from '../../features/billing/domain/billing';
import { HistoryEntity } from '../../features/billing/domain/history';
import { IdempotencyEntity } from '@app/idempotency/domain';
import { OutboxEntity } from '@app/outbox/domain';

config({
  path: './apps/billing/.env',
});
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  return {
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
    logging: false,
    synchronize: false,
    migrations: [
      join(
        process.cwd(),
        'apps',
        'billing',
        'src',
        'db',
        'migrations',
        '*migration.ts',
      ),
    ],
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
