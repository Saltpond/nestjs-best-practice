import { Inject, Injectable } from '@nestjs/common';

import { LoggerService } from '../lib/logger/logger.service';

@Injectable()
export class AppService {
  @Inject('CUSTOME_LOGGER')
  private readonly loggerService: LoggerService;

  getHello(): string {
    this.loggerService.info('hehehehhee');
    return 'Hello World!';
  }
}
