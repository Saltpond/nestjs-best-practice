import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from '../redis/redis.module';
import { DiManager } from './di.manager';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('db'),
      inject: [ConfigService],
    }),
  ],
  providers: [DiManager],
  exports: [DiManager],
})
export class DiModule {}
