/**
 * storage.js
 * Handles data persistence for the Facebook scanning application.
 * Replaces the Chrome storage API used in the extension with a file-based storage system.
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const serverLogger = require('./logging/serverLogger');

// Define file paths for storing data
const config = require('./config');
const CREDENTIALS_FILE = config.CREDENTIALS_FILE;
const GROUP_URLS_FILE = config.GROUP_URLS_FILE;
const LOGS_FILE = config.LOGS_FILE;

// Ensure the data directory exists
async function ensureDataDirectory() {
  try {
    await fs.mkdir(config.DATA_DIRECTORY, { recursive: true });
    serverLogger.info('Data directory ensured', { directory: config.DATA_DIRECTORY });
  } catch (error) {
    serverLogger.error('Failed to ensure data directory', { error: error.message, directory: config.DATA_DIRECTORY });
    throw error;
  }
}

async function saveGroupUrls(groupUrls) {
  try {
    await ensureDataDirectory();
    await fs.writeFile(GROUP_URLS_FILE, JSON.stringify(groupUrls, null, 2));
    serverLogger.info('Group URLs saved successfully', { file: GROUP_URLS_FILE });
  } catch (error) {
    serverLogger.error('Failed to save group URLs', { error: error.message, file: GROUP_URLS_FILE });
    throw error;
  }
}

// Remove a group URL
async function removeGroupUrl(url) {
  try {
    await ensureDataDirectory();
    let groupUrls = [];
    try {
      const data = await fs.readFile(GROUP_URLS_FILE, 'utf-8');
      groupUrls = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        serverLogger.warn('Group URLs file not found', { file: GROUP_URLS_FILE });
        return [];
      }
      throw error;
    }

    if (!groupUrls.includes(url)) {
      serverLogger.warn('Group URL not found', { url });
      return groupUrls;
    }

    // Remove the URL and save the updated list
    groupUrls = groupUrls.filter((groupUrl) => groupUrl !== url);
    await saveGroupUrls(groupUrls);
    serverLogger.info('Group URL removed', { url });
    return groupUrls;
  } catch (error) {
    serverLogger.error('Failed to remove group URL', { error: error.message, url });
    throw error;
  }
}

// Save Facebook credentials
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_key_32_bytes_long!'; // Must be 32 bytes
const IV_LENGTH = 16; // AES block size

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(text) {
  const [iv, encryptedText] = text.split(':');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), Buffer.from(iv, 'hex'));
  let decrypted = decipher.update(Buffer.from(encryptedText, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

async function saveCredentials(username, password) {
  try {
    await ensureDataDirectory();
    const encryptedUsername = encrypt(username);
    const encryptedPassword = encrypt(password);
    const credentials = { username: encryptedUsername, password: encryptedPassword };
    await fs.writeFile(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
    serverLogger.info('Facebook credentials saved successfully', { file: CREDENTIALS_FILE });
  } catch (error) {
    serverLogger.error('Failed to save credentials', { error: error.message, file: CREDENTIALS_FILE });
    throw error;
  }
}

// Get Facebook credentials
async function getCredentials() {
  try {
    const data = await fs.readFile(CREDENTIALS_FILE, 'utf-8');
    const credentials = JSON.parse(data);
    const decryptedUsername = decrypt(credentials.username);
    const decryptedPassword = decrypt(credentials.password);
    serverLogger.info('Facebook credentials retrieved successfully', { file: CREDENTIALS_FILE });
    return { username: decryptedUsername, password: decryptedPassword };
  } catch (error) {
    if (error.code === 'ENOENT') {
      serverLogger.warn('Credentials file not found', { file: CREDENTIALS_FILE });
      return null;
    }
    serverLogger.error('Failed to retrieve credentials', { error: error.message, file: CREDENTIALS_FILE });
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
      serverLogger.info('Group URL added', { url, file: GROUP_URLS_FILE });
    } else {
      serverLogger.warn('Group URL already exists', { url });
    }

    return groupUrls;
  } catch (error) {
    serverLogger.error('Failed to add group URL', { error: error.message, url, file: GROUP_URLS_FILE });
    throw error;
  }
}

// Get all group URLs
async function getGroupUrls() {
  try {
    const data = await fs.readFile(GROUP_URLS_FILE, 'utf-8');
    const groupUrls = JSON.parse(data);
    serverLogger.info('Group URLs retrieved successfully', { file: GROUP_URLS_FILE });
    return groupUrls;
  } catch (error) {
    if (error.code === 'ENOENT') {
      serverLogger.warn('Group URLs file not found', { file: GROUP_URLS_FILE });
      return [];
    }
    serverLogger.error('Failed to retrieve group URLs', { error: error.message, file: GROUP_URLS_FILE });
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
    serverLogger.info('Log saved successfully', { file: LOGS_FILE });
  } catch (error) {
    serverLogger.error('Failed to save log', { error: error.message, file: LOGS_FILE });
    throw error;
  }
}

// Get all logs
async function getLogs() {
  try {
    const data = await fs.readFile(LOGS_FILE, 'utf-8');
    const logs = JSON.parse(data);
    serverLogger.info('Logs retrieved successfully', { file: LOGS_FILE });
    return logs;
  } catch (error) {
    if (error.code === 'ENOENT') {
      serverLogger.warn('Logs file not found', { file: LOGS_FILE });
      return [];
    }
    serverLogger.error('Failed to retrieve logs', { error: error.message, file: LOGS_FILE });
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
  removeGroupUrl,
  saveGroupUrls,
};