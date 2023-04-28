import { registerAs } from '@nestjs/config';

console.log(process.env.APP_ENV)
export default registerAs(
    'redis',
    (): Record<string, any> => ({
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
        db: parseInt(process.env.REDIS_DB),
        password: process.env.REDIS_PASSWORD,
        user:process.env.REDIS_USER,
        keyPrefix: process.env.REDIS_PRIFIX,
        url:process.env.REDIS_PASSWORD &&process.env.REDIS_USER ?`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${parseInt(process.env.REDIS_PORT)}` : `redis://${process.env.REDIS_HOST}:${parseInt(process.env.REDIS_PORT)}` 
    })
);
