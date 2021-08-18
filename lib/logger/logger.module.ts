import { Module } from '@nestjs/common';

import { LoggerService } from './logger.service';

@Module({
  providers: [
    LoggerService,
    {
      provide: 'CUSTOME_LOGGER',
      useFactory: (options) => {
        return new LoggerService('access');
      },
      inject: [],
    },
  ],
  exports: ['CUSTOME_LOGGER', LoggerService],
})
export class LoggerModule {}
