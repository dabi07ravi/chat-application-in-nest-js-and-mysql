import { registerAs } from '@nestjs/config';
export default registerAs(
  'mysql',
  (): Record<string, any> => ({
    host: process.env.DATABASE_HOST || '103.224.245.125',
    port: process.env.DATABASE_PORT || 3306,
    user: process.env.DATABASE_USER || 'hoicko',
    password: process.env.DATABASE_PASSWORD || 'hoicko',
    database: process.env.DATABASE_NAME || 'hoicko',
    url: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`,
  }),
);
