/**
 * logger.js
 * Provides consistent logging functionality with timestamps and log levels.
 * Uses the Winston library for structured and flexible logging.
 */

const winston = require('winston');

// Define log levels and their corresponding colors
const logLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
  },
};

// Apply colors to log levels
winston.addColors(logLevels.colors);

// Create a Winston logger instance
const logger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    // Log errors to a file
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      handleExceptions: true,
    }),
    // Log all levels to a general log file
    new winston.transports.File({
      filename: 'logs/app.log',
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Prevent the logger from exiting the process on error
});

// Add a console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
      ),
      handleExceptions: true,
    })
  );
}

// Export the logger instance for use across the application
module.exports = logger;
