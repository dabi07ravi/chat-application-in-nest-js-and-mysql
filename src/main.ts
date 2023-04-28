import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initFastify, initSentry } from './adapters';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException, ValidationError, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const fastifyAdapter = initFastify();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
  );
  const configService = app.get(ConfigService);
  await app.enableShutdownHooks();
  await app.enableCors();
  initSentry(app);
  
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('rmq.url')],
      queue: configService.get<string>('rmq.queue'),
      queueOptions: {
        durable: true,
      },
    },
  });
  app.useGlobalPipes(new ValidationPipe(
    {
      transform: true,
      skipNullProperties: false,
      skipUndefinedProperties: false,
      skipMissingProperties: false,
      errorHttpStatusCode: 422,
      exceptionFactory: async (errors: ValidationError[]) => {
        return new UnprocessableEntityException({
            statusCode: 422,
            message: 'http.clientError.unprocessableEntity',
            errors,
        });
    },
    }
  ));
  await app.startAllMicroservices();
  // const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
