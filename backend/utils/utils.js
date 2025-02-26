/**
 * utils.js
 * Utility functions for the backend.
 * Provides reusable helper functions for validation, formatting, and other common tasks.
 */

const serverLogger = require('../logging/serverLogger');

/**
 * Validates if a given string is a valid URL.
 * @param {string} url - The URL to validate.
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    serverLogger.warn(`Invalid URL: ${url}`, { error: error.message });
    return false;
  }
}

/**
 * Formats a timestamp into a human-readable string.
 * @param {Date|string} timestamp - The timestamp to format.
 * @returns {string} - The formatted timestamp.
 */
function formatTimestamp(timestamp) {
  try {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    return date.toISOString();
  } catch (error) {
    serverLogger.error(`Error formatting timestamp: ${timestamp}`, { error: error.message });
    return 'Invalid timestamp';
  }
}

/**
 * Generates a unique identifier (UUID v4).
 * @returns {string} - A unique identifier.
 */
function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = (Math.random() * 16) | 0;
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

module.exports = {
  isValidUrl,
  formatTimestamp,
  generateUuid,
};
