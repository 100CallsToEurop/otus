import { NestFactory } from '@nestjs/core';
import { AppBillingModule } from './features/app.billing.module';
import { configApp } from './config';
import { ConfigService } from '@nestjs/config';
import { KafkaConfigService } from '@app/providers/kafka/config';

async function bootstrap() {
  const app = await NestFactory.create(AppBillingModule);

  const kafkaClient = app.get(KafkaConfigService);
  await app.connectMicroservice(kafkaClient.createKafkaOptions());

  await app.startAllMicroservices();

  configApp(app);
  const port = new ConfigService().get('PORT') || 8001;
  const host = new ConfigService().get('PG_HOST');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}, host: ${host}`);
  });
}
bootstrap();
