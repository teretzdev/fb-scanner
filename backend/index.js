/**
 * index.js
 * Entry point for the Node.js backend.
 * Sets up an Express server with basic middleware and a health check route.
 */

const express = require('express');
const bodyParser = require('body-parser');
const serverLogger = require('./logging/serverLogger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */

// Log incoming HTTP requests
app.use((req, res, next) => {
  serverLogger.info(`Incoming request: ${req.method} ${req.url}`, {
    headers: req.headers,
    body: req.body,
  });
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req, res) => {
  serverLogger.info('Health check endpoint hit');
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  serverLogger.error(`Unhandled error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start the server
app.listen(PORT, () => {
  serverLogger.info(`Server is running on http://localhost:${PORT}`);
});
