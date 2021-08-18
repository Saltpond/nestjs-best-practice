import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { configuration } from '../config';
import { DiModule } from '../lib/di/di.module';
import { LoggerModule } from '../lib/logger/logger.module';
import { RedisModule } from '../lib/redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatModule } from './cat/cat.module';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => configService.get('redis'),
      inject: [ConfigService],
    }),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DiModule,
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
