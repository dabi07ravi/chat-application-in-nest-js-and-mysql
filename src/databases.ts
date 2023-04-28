import { Module, DynamicModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool,createPoolCluster } from 'mysql2/promise';
import { DB_CONNECTION } from './constants';
import bluebird from 'bluebird';
@Module({})
export class DbModule {
  static forRootAsync(): DynamicModule {
    const providers = [
      {
        provide: DB_CONNECTION,
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          // const pool = await createPoolCluster({
          //   // options for creating the pool cluster
          //   restoreNodeTimeout:5,
          //   canRetry: true,
          //   removeNodeErrorCount: 5,
          //   defaultSelector: 'RR',
          // });
          // pool.add({
          //   //name: 'MASTER',
          //   bigNumberStrings:true,

          //   waitForConnections:true,
      
          //   host: configService.get<string>('mysql.host'),
          //   user: configService.get<string>('mysql.user'),
          //   password: configService.get<string>('mysql.password'),
          //   database: configService.get<string>('mysql.database'),
          //   port: 3307,
          // });
          
          // pool.add({
          //  // name: 'SLAVE',
          //  bigNumberStrings:true,

          //  waitForConnections:true,
          //   host: configService.get<string>('mysql.host'),
          //   user: configService.get<string>('mysql.user'),
          //   password: configService.get<string>('mysql.password'),
          //   database: configService.get<string>('mysql.database'),
          //   port: 3308,
          // });
          // return await pool.getConnection()
          return await createPool({
            waitForConnections: true,
            host: configService.get<string>('mysql.host'),
            user: configService.get<string>('mysql.user'),
            password: configService.get<string>('mysql.password'),
            database: configService.get<string>('mysql.database'),
            port: configService.get<number>('mysql.port'),
            Promise: bluebird,
          });
        },
      },
    ];
    return {
      module: DbModule,
      providers,
      exports: providers,
    };
  }
}
