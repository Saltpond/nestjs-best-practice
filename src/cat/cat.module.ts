import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { RedisModule } from '../../lib/redis/redis.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
  ],
})
export class CatModule {}
