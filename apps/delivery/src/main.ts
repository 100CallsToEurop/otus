import { NestFactory } from '@nestjs/core';
import { DeliveryModule } from './features/delivery.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './config';

async function bootstrap() {
  const app = await NestFactory.create(DeliveryModule);
  configApp(app);
  const port = new ConfigService().get('PORT') || 8004;
  const host = new ConfigService().get('PG_HOST');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}, host: ${host}`);
  });
}
bootstrap();
