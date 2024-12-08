import { ClientsProviderAsyncOptions } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConfigService } from './kafka.config';

export const clientConfig = (): ClientsProviderAsyncOptions => ({
  name: 'KAFKA_SERVICE',
  useFactory: (configService: ConfigService) =>
    new KafkaConfigService(configService).createKafkaOptions(),
  imports: [ConfigModule],
  inject: [ConfigService],
});
