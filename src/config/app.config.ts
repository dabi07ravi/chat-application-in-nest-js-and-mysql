import { registerAs } from '@nestjs/config';
export default registerAs(
  'app',
  (): Record<string, any> => ({
    env: process.env.APP_ENV || 'development',
    language: process.env.APP_LANGUAGE || 'en',
    timezone: process.env.APP_TZ || 'Asia/Jakarta',
    debug: process.env.APP_DEBUG === 'true' || false,
  }),
);
