import { registerAs } from '@nestjs/config';
export default registerAs(
  'rmq',
  (): Record<string, any> => ({
    host: process.env.RABBITMQ_HOST || 'development',
    port: process.env.RABBITMQ_PORT || 'en',
    user: process.env.RABBITMQ_USER || 'Asia/Jakarta',
    password: process.env.RABBITMQ_PASSWORD === 'true' || false,
    queue: process.env.RABBITMQ_QUEUE === 'true' || false,
    url: `amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_PASSWORD}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
  }),
);
