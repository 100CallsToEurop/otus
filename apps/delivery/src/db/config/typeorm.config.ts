import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CourierEntity } from '../../features/courier/domain/courier';
import { AvailabilitySlotEntity } from '../../features/courier/domain/availability-slot';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PG_HOST'),
    port: +configService.get('PG_PORT'),
    username: configService.get('PG_USERNAME'),
    password: configService.get('PG_PASSWORD'),
    database: configService.get('PG_DATABASE'),
    entities: [CourierEntity, AvailabilitySlotEntity],
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
