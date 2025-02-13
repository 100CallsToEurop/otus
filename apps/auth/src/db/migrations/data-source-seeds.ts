import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';
import { UserEntity } from '../../features/user/domain/user';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ProfileEntity } from '../../features/user/domain/profile';
import { BadTokenEntity } from '../../features/auth/domain';
import { SecurityDeviceEntity } from '../../features/security-device/domain';
import { OutboxEntity } from '@app/outbox/domain';

config({
  path: './apps/auth/.env',
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
      SecurityDeviceEntity,
      BadTokenEntity,
      UserEntity,
      ProfileEntity,
      OutboxEntity,
    ],
    logging: false,
    synchronize: false,
    migrations: [
      join(
        process.cwd(),
        'apps',
        'auth',
        'src',
        'db',
        'migrations',
        '*seed.ts',
      ),
    ],
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());
