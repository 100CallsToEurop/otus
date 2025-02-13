import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { OrderEntity } from '../../features/order/domain';
import { OrderViewEntity } from '../../features/order/domain/view';
import { IdempotentEntity } from '../../features/idempotent/domain';
import { IdempotencyEntity } from '@app/idempotency/domain';
import { OutboxEntity } from '@app/outbox/domain';
import { OrderUserEntity } from '../../features/user/domain';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [
      OrderEntity,
      OrderViewEntity,
      IdempotentEntity,
      OutboxEntity,
      IdempotencyEntity,
      OrderUserEntity,
    ],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
