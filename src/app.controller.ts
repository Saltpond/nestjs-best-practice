import { Controller, Get } from '@nestjs/common';

import { DiManager } from '../lib/di/di.manager';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly di: DiManager) {}

  @Get()
  async getHello(): Promise<string> {
    await this.di.redis.set('info', 'fadfafa');
    const a = await this.di.redis.get('info');
    console.log(a);
    return this.appService.getHello();
  }
}
