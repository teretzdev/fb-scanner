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
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;