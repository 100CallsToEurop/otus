import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { CourierEntity } from '../../features/courier/domain/courier';
import { AvailabilitySlotEntity } from '../../features/courier/domain/availability-slot';

config({
  path: './apps/delivery/.env',
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
    entities: [CourierEntity, AvailabilitySlotEntity],
    logging: false,
    synchronize: false,
    migrations: [
      join(
        process.cwd(),
        'apps',
        'delivery',
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
