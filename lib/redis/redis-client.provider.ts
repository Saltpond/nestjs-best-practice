import { Provider } from '@nestjs/common';
import * as Redis from 'ioredis';

import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
import { RedisClient, RedisModuleAsyncOptions, RedisModuleOptions } from './redis.interface';

export class RedisClientError extends Error {}
export interface RedisInfo {
  defaultKey: string;
  clients: Map<string, RedisClient>;
  size: number;
}

async function getClient(options: RedisModuleOptions): Promise<RedisClient | Redis.Cluster> {
  const { onClientReady, nodes, ...opt } = options;
  const client = nodes ? new Redis.Cluster(nodes) : new Redis(opt);
  if (onClientReady) {
    onClientReady(client);
  }
  return client;
}

export const createClient = (): Provider => ({
  provide: REDIS_CLIENT,
  useFactory: async (options: RedisModuleOptions | RedisModuleOptions[]): Promise<RedisInfo> => {
    const clients = new Map<string, RedisClient>();
    let defaultKey = 'default';

    console.log('create redis client');
    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async (o) => {
          const key = o.name || defaultKey;
          if (clients.has(key)) {
            throw new RedisClientError(`${o.name || 'default'} client is exists`);
          }
          clients.set(key, await getClient(o));
        }),
      );
    } else {
      if (options.name && options.name.length !== 0) {
        defaultKey = options.name;
      }
      clients.set(defaultKey, await getClient(options));
    }

    return {
      defaultKey,
      clients,
      size: clients.size,
    };
  },
  inject: [REDIS_MODULE_OPTIONS],
});

export const createAsyncClientOptions = (options: RedisModuleAsyncOptions) => ({
  provide: REDIS_MODULE_OPTIONS,
  useFactory: options.useFactory,
  inject: options.inject,
});
