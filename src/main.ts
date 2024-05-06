import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('app.port'));

  Logger.log(
    `App is listening on port ${configService.get('app.port')} ...`,
    'Bootstrap',
  );
}
bootstrap();
