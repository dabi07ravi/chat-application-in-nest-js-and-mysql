import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from './config';
import { DbModule } from './databases';
import { RouterModule } from '@nestjs/core';
import { RedisModule } from './redis';
import { ChatModule } from './module/users/chat/chat.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),
    DbModule.forRootAsync(),
    RedisModule.forRootAsync(),
    ChatModule,
    RouterModule.register([
      {
        path: '/public',
        module: ChatModule,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
