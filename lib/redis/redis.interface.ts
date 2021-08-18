import { ModuleMetadata } from '@nestjs/common/interfaces';
import { Cluster, Redis, RedisOptions } from 'ioredis';

export type RedisClient = Redis | Cluster;

export interface RedisModuleOptions extends RedisOptions {
  name?: string;
  nodes?: RedisModuleOptions[];
  onClientReady?(client: RedisClient): void;
}

export interface RedisModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) =>
    | RedisModuleOptions
    | RedisModuleOptions[]
    | Promise<RedisModuleOptions>
    | Promise<RedisModuleOptions[]>;
  inject?: any[];
}
