import { FastifyAdapter } from '@nestjs/platform-fastify';
import helmet from '@fastify/helmet';
import { HelmetOptions } from 'helmet';
import * as Sentry from '@sentry/node';
import { Client } from '@sentry/types';
import { INestApplication } from '@nestjs/common';
export const initFastify = (): FastifyAdapter => {
  const fastifyAdapter = new FastifyAdapter({
    logger: true,
    bodyLimit: 1024 * 1024 * 100,
  });
  const helmetOptions: HelmetOptions = {
    // update script-src to be compatible with swagger
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'"],
        'base-uri': ["'self'"],
        'block-all-mixed-content': [],
        'font-src': ["'self'", 'https:', 'data:'],
        'frame-ancestors': ["'self'"],
        'img-src': ["'self'", 'data:'],
        'object-src': ["'none'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'script-src-attr': ["'none'"],
        'style-src': ["'self'", 'https:', "'unsafe-inline'"],
        'upgrade-insecure-requests': [],
      },
    },
  };
  fastifyAdapter.register(helmet, helmetOptions);

  return fastifyAdapter;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initSentry = (_app: INestApplication) => {
  const sentryDsn = process.env.SENTRY_DSN;
  const isDevMode = String(process.env.APP_ENV).toUpperCase() != 'PRODUCTION';
  if (isDevMode) {
    return;
  }
  Sentry.init({
    tracesSampleRate: 1.0,
    debug: isDevMode,
    enabled: Boolean(!isDevMode && sentryDsn),
    dsn: sentryDsn,
    environment: String(process.env.APP_ENV).toUpperCase(),
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.Mysql(),
      new Sentry.Integrations.Express({ app: _app.getHttpServer() }),
      new Sentry.Integrations.OnUncaughtException({
        onFatalError: (err) => {
          if (err.name === 'SentryError') {
            console.log(err);
          } else {
            (
              Sentry.getCurrentHub().getClient<Client>() as Client
            ).captureException(err);
            process.exit(1);
          }
        },
      }),
      new Sentry.Integrations.OnUnhandledRejection({ mode: 'warn' }),
    ],
  });
  // _app.use(Sentry.Handlers.requestHandler());
  // // TracingHandler creates a trace for every incoming request
  // _app.use(Sentry.Handlers.tracingHandler());

  // // the rest of your app

  // _app.use(Sentry.Handlers.errorHandler());
};
