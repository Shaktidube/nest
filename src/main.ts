import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.enableCors({
    origin: [config.get<string>('FRONTEND_URL')],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  console.log(
    `Server is running on port ${config.get<number>('PORT') ?? 3000}`,
  );
  await app.listen(config.get<number>('PORT') ?? 3000);
}
bootstrap();
