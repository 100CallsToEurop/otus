import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { UserEntity } from '../../features/user/domain';
import { DataSource, DataSourceOptions } from 'typeorm';

config({
  path: '.env',
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
    entities: [UserEntity],
    logging: false,
    synchronize: false,
    migrations: [
      join(process.cwd(), 'src', 'db', 'migrations', '*migration.ts'),
    ],
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
