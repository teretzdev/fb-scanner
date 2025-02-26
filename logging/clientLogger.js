/**
 * clientLogger.js
 * Centralized client-side logging module for the Chrome extension.
 * Provides consistent logging functionality across popup.js, content.js, and background.js.
 */

// Define log levels and their corresponding console methods
const logLevels = {
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
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
function log(level, message, meta = {}) {
  if (!logLevels[level]) {
    console.error(`[${getTimestamp()}] [ERROR] Invalid log level: ${level}`);
    return;
  }

  const metaString = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
  logLevels[level](`[${getTimestamp()}] [${level.toUpperCase()}] ${message} ${metaString}`);
}

module.exports = {
  log,
};