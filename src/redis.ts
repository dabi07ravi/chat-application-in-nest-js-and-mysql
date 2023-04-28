import { DynamicModule, Injectable, Module, OnApplicationBootstrap, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, RedisClientType, SchemaFieldTypes } from 'redis'
import { REDIS_CONNECTION } from "./constants";
// import { RedisClientType } from '@redis/client';

export enum RedisTable {
  User = 'users',
  DomainTable = "domain_profile",
  Communication = "communication"
}

@Injectable()
export class RedisService implements OnApplicationBootstrap, OnApplicationShutdown {
  readonly client: RedisClientType;

  constructor(private readonly configService: ConfigService) {
    this.client = createClient({
      socket: {
        host: configService.get<string>("redis.host"),
        port: configService.get<number>("redis.port"),
      },
      password: configService.get<string>("redis.password"),
      username: configService.get<string>("redis.user"),
      database: configService.get<number>("redis.db"),

    });
  }
  async onApplicationBootstrap() {
    await this.client.connect()

    // await this.client.ft.dropIndex(RedisTable.User)
    // await this.client.ft.dropIndex(RedisTable.DomainTable)
    const haveDomainIndex: any = await this.client.ft._LIST()
     
    if (!haveDomainIndex.includes(RedisTable.DomainTable)) {
      await this.client.ft.create(RedisTable.DomainTable, {
        '$.account_url': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'account_url'
        },
        '$.account_name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'account_name'
        },
      }, {
        ON: 'JSON',
        PREFIX: 'hoicko:domain_profile',

      })
    }
    if (!haveDomainIndex.includes(RedisTable.User)) {
      await this.client.ft.create(RedisTable.User, {
        '$.email': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'email'
        },
        '$.phone': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'phone'
        },
        '$.first_name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'first_name'
        },
        '$.last_name': {
          type: SchemaFieldTypes.TEXT,
          SORTABLE: true,
          AS: 'last_name'
        },
      }, {
        ON: 'JSON',
        PREFIX: 'hoicko:domain_profile',

      })
    }
  }
  async onApplicationShutdown() {
    await this.client.disconnect()
  }
  async get(table: RedisTable, key: string): Promise<any> {
return await this.client.json.get(`hoicko:${table}:${key}`)
    // return Promise.resolve(JSON.parse(await this.client.json.GET()  .call("JSON.GET", `hoicko:${table}:${key}`) as string))
  }
  // async getUser(userId: string): Promise<IUserDocument> {

  //   return Promise.resolve(JSON.parse(await this.client.call("JSON.GET", `hoicko:users:${userId}`) as string))
  // }


  // async getUsers(userIds: string[]): Promise<IUserDocument[]> {


  //   try {
  //     const keys = userIds.map(id => `hoicko:users:${id}`);
  //     console.log(keys)
  //     const userValues = await this.client.call("JSON.MGET", ...keys, ".") as Array<string>;
  //     return userValues
  //       .filter(userValue => userValue !== null)
  //       .map(userValue => JSON.parse(userValue)) as IUserDocument[];
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }



  // async search(tabel: RedisTable, search: string): Promise<any> {
  //   const resp: any = await this.client.sendCommand(new Command("FT.SEARCH", [tabel, search]))

  //   return resp && resp.length > 1 ? JSON.parse(String(String(resp).split("$")[1]).replace(",", "")) : undefined
  // }
  // async updateUser(userId: string, data: Record<string, any>): Promise<boolean> {
  //   try {
  //     const _user: IUserDocument = await this.getUser(userId)
  //     await this.client.call("JSON.SET", `hoicko:users:${userId}`, JSON.stringify({ ..._user, ...data }))
  //     return true
  //   } catch (error) {
  //     return false
  //   }
  // }
  // async deleteUser(userId: string): Promise<IUserDocument> {
  //   return Promise.resolve(await this.client.call("JSON.DEL", `hoicko:users:${userId}`, "$") as any)
  // }


  // async getFavourites(user_id: string): Promise<any> {
  //   try {
  //     return Promise.resolve(await this.client.smembers(`hoicko:user_favourite:user:${user_id}:board`));
  //   } catch (err) {
  //     console.log(err)
  //   }

  // }


  // async getBoards(userIds: string[]): Promise<any[]> {

  //   try {
  //     const keys = userIds.map(id => `hoicko:board:${id}`);
  //     const boards = await this.client.call("JSON.MGET", ...keys, ".") as any;
  //      return boards
  //       .filter(board => board !== null)
  //       .map(board => JSON.parse(board))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


}


@Module({})
export class RedisModule {
  static forRootAsync(): DynamicModule {


    const providers = [
      // {
      //   provide: 'RedisModuleOptions',
      //   useFactory: options.useFactory,
      //   inject: options.inject,
      // },
      {
        provide: REDIS_CONNECTION,
        useFactory: (configService: ConfigService) => {
          return new RedisService(configService);
        },
        inject: [ConfigService],
      },
    ];
    return {
      module: RedisModule,

      providers,
      exports: providers,
    };
  }
}