import { createLogger, format, transports } from 'winston';
import path from 'path';
import 'winston-daily-rotate-file';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack }) => {
      return stack ? `${timestamp} [${level}]: ${message} - ${stack}` : `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // new transports.File({ filename: "logs/error.log", level: "error" }),
    // new transports.Console(),
    new transports.DailyRotateFile({
      filename: path.join('logs', 'error.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '7d', 
      auditFile: path.join('logs', 'audit.json'),
      zippedArchive: true,
    }),
    new transports.Console(),
  ],
});

export default logger;
