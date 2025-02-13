import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ProductEntity } from '../../features/product/domain/product';
import { ReservedProductEntity } from '../../features/product/domain/reserved-product';
import { OutboxEntity } from '@app/outbox/domain';
import { IdempotencyEntity } from '@app/idempotency/domain';

config({
  path: './apps/warehouse/.env',
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
      ProductEntity,
      ReservedProductEntity,
      OutboxEntity,
      IdempotencyEntity,
    ],
    logging: false,
    synchronize: false,
    migrations: [
      join(
        process.cwd(),
        'apps',
        'warehouse',
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
