/**
 * routes/health.js
 * Provides a health check endpoint to verify that the server is running properly.
 */

const express = require('express');
const router = express.Router();

// Health check route
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'server running',
    appName: 'FB Scanner',
    appVersion: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;