import { NestFactory } from '@nestjs/core';
import { AppBillingModule } from './features/app.billing.module';
import { configApp } from './config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppBillingModule);

  configApp(app);
  const port = new ConfigService().get('PORT') || 8001;
  const host = new ConfigService().get('PG_HOST');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}, host: ${host}`);
  });
}
bootstrap();
