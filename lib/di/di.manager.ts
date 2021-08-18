import { Injectable } from '@nestjs/common';

import { RedisClient } from '../redis/redis.interface';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DiManager {
  public readonly redis: RedisClient;

  constructor(private readonly redisService: RedisService) {
    this.redis = redisService.getClient();
  }
}
