/**
 * storage.js
 * Handles data persistence for the Facebook scanning application.
 * Replaces the Chrome storage API used in the extension with a file-based storage system.
 */

const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');

// Define file paths for storing data
const DATA_DIR = path.join(__dirname, 'data');
const CREDENTIALS_FILE = path.join(DATA_DIR, 'credentials.json');
const GROUP_URLS_FILE = path.join(DATA_DIR, 'groupUrls.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');

// Ensure the data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    logger.info('Data directory ensured');
  } catch (error) {
    logger.error(`Failed to ensure data directory: ${error.message}`);
    throw error;
  }
}

// Save Facebook credentials
async function saveCredentials(username, password) {
  try {
    await ensureDataDirectory();
    const credentials = { username, password };
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
    logger.info('Facebook credentials saved successfully');
  } catch (error) {
    logger.error(`Failed to save credentials: ${error.message}`);
    throw error;
  }
}

// Get Facebook credentials
async function getCredentials() {
  try {
    const data = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
    const credentials = JSON.parse(data);
    logger.info('Facebook credentials retrieved successfully');
    return credentials;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn('Credentials file not found');
      return null;
    }
    logger.error(`Failed to retrieve credentials: ${error.message}`);
    throw error;
  }
}

// Add a group URL
async function addGroupUrl(url) {
  try {
    await ensureDataDirectory();
    let groupUrls = [];
    try {
      const data = await fs.readFile(GROUP_URLS_FILE, 'utf-8');
      groupUrls = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    if (!groupUrls.includes(url)) {
      groupUrls.push(url);
      await fs.writeFile(GROUP_URLS_FILE, JSON.stringify(groupUrls, null, 2));
      logger.info(`Group URL added: ${url}`);
    } else {
      logger.warn(`Group URL already exists: ${url}`);
    }

    return groupUrls;
  } catch (error) {
    logger.error(`Failed to add group URL: ${error.message}`);
    throw error;
  }
}

// Get all group URLs
async function getGroupUrls() {
  try {
    const data = await fs.readFile(GROUP_URLS_FILE, 'utf-8');
    const groupUrls = JSON.parse(data);
    logger.info('Group URLs retrieved successfully');
    return groupUrls;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn('Group URLs file not found');
      return [];
    }
    logger.error(`Failed to retrieve group URLs: ${error.message}`);
    throw error;
  }
}

// Save logs
async function saveLog(message) {
  try {
    await ensureDataDirectory();
    let logs = [];
    try {
      const data = await fs.readFile(LOGS_FILE, 'utf-8');
      logs = JSON.parse(data);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }

    const timestamp = new Date().toISOString();
    logs.push({ timestamp, message });
    await fs.writeFile(LOGS_FILE, JSON.stringify(logs, null, 2));
    logger.info('Log saved successfully');
  } catch (error) {
    logger.error(`Failed to save log: ${error.message}`);
    throw error;
  }
}

// Get all logs
async function getLogs() {
  try {
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    const logs = JSON.parse(data);
    logger.info('Logs retrieved successfully');
    return logs;
  } catch (error) {
    if (error.code === 'ENOENT') {
      logger.warn('Logs file not found');
      return [];
    }
    logger.error(`Failed to retrieve logs: ${error.message}`);
    throw error;
  }
}

module.exports = {
  saveCredentials,
  getCredentials,
  addGroupUrl,
  getGroupUrls,
  saveLog,
  getLogs,
};
