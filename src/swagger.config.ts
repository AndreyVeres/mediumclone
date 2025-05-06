import { applyDecorators, INestApplication } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOkResponse, DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger';

interface AppSwaggerResponseProps {
  property?: string;
  model?: any;
  type?: string;
  apiBody?: any;
}

export function AppSwagger({ property, model, type, apiBody }: AppSwaggerResponseProps) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type,
        properties: {
          [property]: { $ref: getSchemaPath(model) },
        },
      },
    }),
    ApiBody({ type: apiBody }),
  );
}

export const createSwaggerDocument = (app: INestApplication<any>) => {
  const options = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('Your API Tag')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
