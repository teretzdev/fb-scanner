/**
 * utils.js
 * Utility module for common tasks such as URL validation, data formatting, and error handling.
 * Provides reusable helper functions to improve code maintainability and reduce redundancy.
 */

const logger = require('./logger');

/**
 * Validates whether a given string is a valid URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    logger.warn(`Invalid URL: ${url}`);
    return false;
  }
}

/**
 * Formats a timestamp into a human-readable string.
 * @param {string|Date} timestamp - The timestamp to format.
 * @returns {string} - The formatted timestamp.
 */
function formatTimestamp(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
  } catch (error) {
    logger.error(`Error formatting timestamp: ${error.message}`);
    return 'Invalid date';
  }
}

/**
 * Handles errors by logging them and returning a standardized error response.
 * @param {Error} error - The error to handle.
 * @param {string} context - Additional context about where the error occurred.
 * @returns {Object} - A standardized error response object.
 */
function handleError(error, context = 'Unknown context') {
  logger.error(`Error in ${context}: ${error.message}`);
  return {
    success: false,
    message: `An error occurred: ${error.message}`,
  };
}

/**
 * Debounces a function, ensuring it is only called after a specified delay.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay in milliseconds.
 * @returns {Function} - The debounced function.
 */
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttles a function, ensuring it is only called at most once in a specified interval.
 * @param {Function} func - The function to throttle.
 * @param {number} interval - The interval in milliseconds.
 * @returns {Function} - The throttled function.
 */
function throttle(func, interval) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
}

module.exports = {
  isValidUrl,
  formatTimestamp,
  handleError,
  debounce,
  throttle,
  logWithLevel,
};

/**
 * Logs a message with the specified log level.
 * @param {string} level - The log level (e.g., 'info', 'warn', 'error').
 * @param {string} message - The message to log.
 */
function logWithLevel(level, message) {
  if (logger[level]) {
    logger[level](message);
  } else {
    logger.warn(`Invalid log level: ${level}. Message: ${message}`);
  }
}