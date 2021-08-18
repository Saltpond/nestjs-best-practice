import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import { format } from 'winston';

const chalk = require('chalk');

const nestLikeColorScheme = {
  info: chalk.green,
  error: chalk.red,
  warn: chalk.yellow,
  debug: chalk.magentaBright,
  verbose: chalk.cyanBright,
};

const consoleLoggerFormat = (appName = 'APP') =>
  format.printf(({ context, level, timestamp, message, ms, trackId, ...meta }) => {
    const color = nestLikeColorScheme[level] || ((text: string): string => text);

    const appNameOutput = typeof appName !== 'undefined' ? chalk.magentaBright(`[${appName}]`) : '';
    const timestampOutput = typeof timestamp !== 'undefined' ? chalk.cyanBright(timestamp) : '';
    const levelOutput = color(level.charAt(0).toUpperCase() + level.slice(1).toUpperCase());
    const msOutput = typeof ms !== 'undefined' ? ` ${chalk.yellow(ms)}` : '';
    const trackIdOutput = typeof trackId !== 'undefined' ? chalk.cyan(trackId) : '';
    const messageOutput = color(message);
    return `${appNameOutput} ${timestampOutput} ${trackIdOutput} ${levelOutput} ${messageOutput} - ${JSON.stringify(
      meta,
    )} ${msOutput}`;
  });

const accessLoggerFormat = () =>
  format.printf(({ timestamp, message, trackId, method, url, ip, ...meta }) => {
    const appNameOutput = '[ACCESS]';
    const timestampOutput = typeof timestamp !== 'undefined' ? chalk.cyanBright(timestamp) : '';
    const trackIdOutput = typeof trackId !== 'undefined' ? chalk.cyan(trackId) : '';
    return `${appNameOutput} ${timestampOutput} ${trackIdOutput} ${method} ${url} ${ip} - ${JSON.stringify(
      meta,
    )}`;
  });

const options = {
  app: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: format.combine(format.timestamp(), format.ms(), consoleLoggerFormat(), format.splat()),
  },
  access: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    format: format.combine(format.timestamp(), accessLoggerFormat(), format.splat()),
  },
};

const normalLogger = winston.createLogger({
  transports: [new winston.transports.Console(options.app)],
  exitOnError: false, // do not exit on handled exceptions
});

const accessLogger = winston.createLogger({
  transports: [new winston.transports.Console(options.access)],
  exitOnError: false, // do not exit on handled exceptions
});

@Injectable()
export class LoggerService extends Logger {
  private logger: winston.Logger;

  constructor(loggerType?: string) {
    super();
    if (loggerType === 'access') {
      this.logger = accessLogger;
    } else {
      this.logger = normalLogger;
    }
  }

  log(message: string | Object): void {
    if (typeof message === 'string') {
      this.info(message);
    } else {
      // @ts-ignore
      const { level = 'info' } = message;
      this[level](message);
    }
  }

  error(error: string | Error): void {
    let formatError;
    if (error instanceof Error) {
      const { stack } = error;
      formatError = `${stack}\n${JSON.stringify(error, null, 4)}`;
    } else {
      formatError = error;
    }

    const store: any = {};
    const { trackingId } = store || {};
    formatError = { message: formatError };
    if (trackingId) Object.assign(formatError, { trackId: trackingId });
    this.logger.error(formatError);
  }

  info(message: string | Object): void {
    const store: any = {};
    const { trackingId } = store || {};
    const formatMessage = typeof message === 'string' ? { message } : message;
    if (trackingId) Object.assign(formatMessage, { trackId: trackingId });
    this.logger.info(formatMessage);
  }

  warn(message: string | Object): void {
    const store: any = {};
    const { trackingId } = store || {};
    const formatMessage = typeof message === 'string' ? { message } : message;
    if (trackingId) Object.assign(formatMessage, { trackId: trackingId });
    this.logger.warn(formatMessage);
  }

  debug(message: string | Object): void {
    const store: any = {};
    const { trackingId } = store || {};
    const formatMessage = typeof message === 'string' ? { message } : message;
    if (trackingId) Object.assign(formatMessage, { trackId: trackingId });
    this.logger.debug(formatMessage);
  }
}
