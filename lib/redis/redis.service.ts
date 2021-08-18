import { Inject, Injectable } from '@nestjs/common';

import { REDIS_CLIENT } from './redis.constants';
import { RedisClient } from './redis.interface';
import { RedisInfo, RedisClientError } from './redis-client.provider';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: RedisInfo) {
    console.log('infoofofofoof');
  }

  getClient(name?: string): RedisClient {
    if (!name) {
      // eslint-disable-next-line no-param-reassign
      name = this.redisClient.defaultKey;
    }
    if (!this.redisClient.clients.has(name)) {
      throw new RedisClientError(`client ${name} does not exist`);
    }
    return this.redisClient.clients.get(name);
  }

  getClients(): Map<string, RedisClient> {
    return this.redisClient.clients;
  }
}
