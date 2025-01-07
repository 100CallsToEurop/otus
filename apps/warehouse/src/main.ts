import { NestFactory } from '@nestjs/core';
import { WarehouseModule } from './features/warehouse.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './config';

async function bootstrap() {
  const app = await NestFactory.create(WarehouseModule);
  configApp(app);
  const port = new ConfigService().get('PORT') || 8005;
  const host = new ConfigService().get('PG_HOST');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}, host: ${host}`);
  });
}
bootstrap();
