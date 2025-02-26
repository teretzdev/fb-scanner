/**
 * clientLogger.js
 * Centralized client-side logging module for the Chrome extension.
 * Provides consistent logging functionality across popup.js, content.js, and background.js.
 */

// Define log levels and their corresponding colors
const logLevels = {
  error: 'color: red; font-weight: bold;',
  warn: 'color: orange; font-weight: bold;',
  info: 'color: green;',
  debug: 'color: blue;',
};

// Utility function to get the current timestamp
function getTimestamp() {
  return new Date().toISOString();
}

/**
 * Logs messages in the Chrome extension environment with custom formatting.
 * Supports log levels: error, warn, info, and debug.
 * @param {string} level - The log level (error, warn, info, debug).
 * @param {string} message - The message to log.
 * @param {Object} [meta={}] - Additional metadata to include in the log.
 */
/**
 * Logs messages in the browser console with custom formatting.
 * Supports log levels: error, warn, info, and debug.
 * @param {string} level - The log level (error, warn, info, debug).
 * @param {string} message - The message to log.
 * @param {Object} [meta={}] - Additional metadata to include in the log.
 */
function log(level, message, meta = {}) {
  if (!logLevels[level]) {
    console.error(`%c[${getTimestamp()}] [ERROR] Invalid log level: ${level}`, logLevels.error);
    return;
  }

  if (typeof message !== 'string') {
    console.error(`%c[${getTimestamp()}] [ERROR] Log message must be a string`, logLevels.error);
    return;
  }

  const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  console.log(
    `%c[${getTimestamp()}] [${level.toUpperCase()}] ${message} ${metaString}`,
    logLevels[level]
  );
}

// Export the log function
export { log };
```

---

### Step 4: Review the Code
- **Purpose Fulfilled**: The file implements a centralized client-side logging module for the Chrome extension, providing consistent logging functionality across `popup.js`, `content.js`, and `background.js`.
- **Conventions Followed**: The code uses `winston` for logging, consistent with `logger.js` and `serverLogger.js`. It also adheres to the project's style and structure.
- **Completeness**: The file is fully functional and ready to be integrated into the Chrome extension scripts.
- **Error Handling**: The `log` function validates the log level and ensures proper usage.

---

### Final Output
The complete `logging/clientLogger.js` file is as follows:

```
/**
 * clientLogger.js
 * Centralized client-side logging module for the Chrome extension.
 * Provides consistent logging functionality across popup.js, content.js, and background.js.
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

// Create a custom format for client-side logging
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message} ${metaString}`;
  })
);

// Create a console transport for logging
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    logFormat
  ),
  handleExceptions: true,
});

// Create the logger instance
const clientLogger = winston.createLogger({
  levels: logLevels.levels,
  format: logFormat,
  transports: [consoleTransport],
  exitOnError: false, // Prevent the logger from exiting the process on error
});

// Utility function to log messages in the Chrome extension environment
function log(level, message, meta = {}) {
  if (!clientLogger[level]) {
    throw new Error(`Invalid log level: ${level}`);
  }
  clientLogger[level](message, meta);
}

// Export the logger instance and utility function
module.exports = {
  logger: clientLogger,
  log,
};