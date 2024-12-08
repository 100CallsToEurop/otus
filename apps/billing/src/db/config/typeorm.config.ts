import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { WalletEntity } from '../../features/user/domain/wallet';
import { UserEntity } from '../../features/user/domain/user';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [UserEntity, WalletEntity],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
