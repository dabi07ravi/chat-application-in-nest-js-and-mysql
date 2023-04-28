import { Module } from '@nestjs/common';
import { DbModule } from 'src/databases';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
    imports: [DbModule.forRootAsync(), RedisModule.forRootAsync(), JwtModule.registerAsync({
        inject: [ConfigService],
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>(
                'helper.jwt.defaultSecretKey'
            ),
            signOptions: {
                expiresIn: configService.get<string>(
                    'helper.jwt.defaultExpirationTime'
                ),
            },
        }),
    }),],
    exports: [ChatService],
    providers: [ChatService],
    controllers: [ChatController],
})
export class ChatModule { }
