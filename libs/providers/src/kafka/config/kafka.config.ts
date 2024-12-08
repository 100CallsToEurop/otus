import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class KafkaConfigService {
  constructor(private readonly configService: ConfigService) {}

  createKafkaOptions(): { transport: Transport; options: any } {
    return {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: this.configService.get('KAFKA_CLIENT_ID'),
          brokers: [this.configService.get('KAFKA_BROKER')],
        },
        producerOnlyMode: this.configService.get('KAFKA_IS_ONLY_PRODUCER'),
        consumer: {
          groupId: this.configService.get('KAFKA_GROUP_ID'),
          allowAutoTopicCreation: true,
        },
      },
    };
  }
}
