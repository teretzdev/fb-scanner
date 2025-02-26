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

// Create a basic Winston logger instance
const fallbackLogger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
  ),
  transports: [
    // Log all levels to a fallback log file
    new winston.transports.File({
      filename: 'logs/fallback.log',
      handleExceptions: true,
    }),
    // Add a console transport for all environments
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}] ${message}`)
      ),
      handleExceptions: true,
    }),
  ],
  exitOnError: false, // Prevent the logger from exiting the process on error
});

// Export the fallback logger instance for use across the application
module.exports = fallbackLogger;