/* istanbul ignore file */

//import winston from 'winston';
import winston = require('winston');

// npm debug levels (winston default):
// {
//   error: 0,
//   warn: 1,
//   info: 2,
//   http: 3
//   verbose: 4,
//   debug: 5,
//   silly: 6
// }

const prettyJson = winston.format.printf((info) => {
  if (info.message.constructor === Object) {
    info.message = JSON.stringify(info.message, null, 4);
  }
  return `${info.timestamp} ${info.label || '-'} ${info.level}: ${
    info.message
  }`;
});

const logger = winston.createLogger({
  level:
    process.env.loggerLevel === 'silent' ? undefined : process.env.loggerLevel,
  silent: process.env.loggerLevel === 'silent',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    prettyJson,
  ),
  defaultMeta: { service: 'trade2023' },
  transports: [new winston.transports.Console({})],
});

export default logger;
