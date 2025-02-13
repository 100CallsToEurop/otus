import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ProductEntity } from '../../features/product/domain/product';
import { ReservedProductEntity } from '../../features/product/domain/reserved-product';
import { IdempotencyEntity } from '@app/idempotency/domain';
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
      ProductEntity,
      ReservedProductEntity,
      OutboxEntity,
      IdempotencyEntity,
    ],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
