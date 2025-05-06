import { applyDecorators, INestApplication } from '@nestjs/common';
import { ApiBody, ApiExtraModels, ApiOkResponse, DocumentBuilder, getSchemaPath, SwaggerModule } from '@nestjs/swagger';

interface AppSwaggerResponseProps {
  wrapName?: string;
  model?: any;
  type?: string;
  apiBody?: any;
}

export function AppSwagger({ wrapName, model, type, apiBody }: AppSwaggerResponseProps) {
  const decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator> = [];

  if (apiBody) {
    decorators.push(ApiBody({ type: apiBody }));
  }

  return applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        type,
        properties: {
          [wrapName]: { $ref: getSchemaPath(model) },
        },
      },
    }),
    ...decorators,
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
