import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UserEntity } from '../../features/user/domain/user';
import { ProfileEntity } from '../../features/user/domain/profile';
import { BadTokenEntity } from '../../features/auth/domain';
import { SecurityDeviceEntity } from '../../features/security-device/domain';
import { OutboxEntity } from '@app/outbox/domain';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [
      UserEntity,
      ProfileEntity,
      BadTokenEntity,
      SecurityDeviceEntity,
      OutboxEntity,
    ],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
