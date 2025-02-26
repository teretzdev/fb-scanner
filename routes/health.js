/**
 * routes/health.js
 * Provides a health check endpoint to verify that the server is running properly.
 */

const express = require('express');
const router = express.Router();
const logger = require('../logger');

// Health check route
router.get('/', (req, res) => {
  logger.info('Health check endpoint hit');
  
  const response = {
    success: true,
    message: 'server running',
    appName: 'FB Scanner',
    appVersion: '1.0.0',
    timestamp: new Date().toISOString(),
  };

  logger.info(`Health check response: ${JSON.stringify(response)}`);
  res.status(200).json(response);
});

module.exports = router;