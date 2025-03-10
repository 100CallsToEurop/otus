import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { OrderEntity } from '../../features/order/domain';
import { OrderViewEntity } from '../../features/order/domain/view';
import { OutboxEntity } from '@app/outbox/domain';
import { IdempotencyEntity } from '@app/idempotency/domain';
import { IdempotentEntity } from '../../features/idempotent/domain';
import { OrderUserEntity } from '../../features/user/domain';

config({
  path: './apps/order/.env',
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
      OrderEntity,
      OrderViewEntity,
      OutboxEntity,
      IdempotentEntity,
      IdempotencyEntity,
      OrderUserEntity,
    ],
    logging: false,
    synchronize: false,
    migrations: [
      join(
        process.cwd(),
        'apps',
        'order',
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
