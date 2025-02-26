/**
 * app.js
 * Entry point for the Facebook scanning application.
 * Initializes the Express server, sets up routes, and handles core application logic.
 */

const express = require('express');
const bodyParser = require('body-parser');
const scanner = require('./scanner');
const storage = require('./storage');
const logger = require('./logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Routes

// Route: Health Check
app.get('/health', (req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Route: Save Facebook Credentials
app.post('/api/credentials', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    logger.warn('Missing username or password in credentials request');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    await storage.saveCredentials(username, password);
    logger.info('Facebook credentials saved successfully');
    res.status(200).json({ message: 'Credentials saved successfully' });
  } catch (error) {
    logger.error(`Error saving credentials: ${error.message}`);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
});

// Route: Add Group URL
app.post('/api/group-urls', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    logger.warn('Missing URL in group URL request');
    return res.status(400).json({ error: 'Group URL is required' });
  }

  try {
    const updatedUrls = await storage.addGroupUrl(url);
    logger.info(`Group URL added: ${url}`);
    res.status(200).json({ message: 'Group URL added successfully', groupUrls: updatedUrls });
  } catch (error) {
    logger.error(`Error adding group URL: ${error.message}`);
    res.status(500).json({ error: 'Failed to add group URL' });
  }
});

// Route: Get Group URLs
app.get('/api/group-urls', async (req, res) => {
  try {
    const groupUrls = await storage.getGroupUrls();
    logger.info('Fetched group URLs successfully');
    res.status(200).json({ groupUrls });
  } catch (error) {
    logger.error(`Error fetching group URLs: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch group URLs' });
  }
});

// Route: Start Scanning
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    logger.warn('Missing URL in scan request');
    return res.status(400).json({ error: 'URL is required for scanning' });
  }

  try {
    const scanResult = await scanner.scanUrl(url);
    logger.info(`Scanning completed for URL: ${url}`);
    res.status(200).json({ message: 'Scanning completed', data: scanResult });
  } catch (error) {
    logger.error(`Error during scanning: ${error.message}`);
    res.status(500).json({ error: 'Failed to scan URL' });
  }
});

// Route: Get Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await storage.getLogs();
    logger.info('Fetched logs successfully');
    res.status(200).json({ logs });
  } catch (error) {
    logger.error(`Error fetching logs: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});
