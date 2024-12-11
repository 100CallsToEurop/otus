import { NestFactory } from '@nestjs/core';
import { AppModule } from './features/app.module';
import { ConfigService } from '@nestjs/config';
import { configApp } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configApp(app);
  const port = new ConfigService().get('PORT') || 8000;
  const host = new ConfigService().get('PG_HOST');
  await app.listen(port, () => {
    console.log(`Server started on port: ${port}, host: ${host}`);
  });
}
bootstrap();
