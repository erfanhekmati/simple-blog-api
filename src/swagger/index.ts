import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function SwaggerIntialize(app: INestApplication<any>) {
  const configService = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('swagger.title'))
    .setDescription(configService.get('swagger.description'))
    .setVersion(configService.get('app.version'))
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  const swaggerOptions = {
    swaggerOptions: {
      operationsSorter: (a, b) => {
        const methodsOrder = [
          'get',
          'post',
          'put',
          'patch',
          'delete',
          'options',
          'trace',
        ];
        let result =
          methodsOrder.indexOf(a.get('method')) -
          methodsOrder.indexOf(b.get('method'));
        if (result === 0) result = a.get('path').localeCompare(b.get('path'));
        return result;
      },
    },
  };

  SwaggerModule.setup(
    configService.get('swagger.path'),
    app,
    swaggerDocument,
    swaggerOptions,
  );
}
