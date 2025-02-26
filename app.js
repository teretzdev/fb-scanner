/**
 * app.js
 * Entry point for the Facebook scanning application.
 * Initializes the Express server, sets up routes, and handles core application logic.
 */

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('./logger');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 * Logs incoming requests and outgoing responses.
 */
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  res.on('finish', () => {
    logger.info(`Response sent: ${res.statusCode} ${req.method} ${req.url}`);
  });
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));

const healthRoutes = require('./routes/health');
const credentialsRoutes = require('./routes/credentials');
const groupUrlsRoutes = require('./routes/groupUrls');
const scanRoutes = require('./routes/scan');
const logsRoutes = require('./routes/logs');

// Routes
app.use('/health', healthRoutes);
app.use('/api/credentials', credentialsRoutes);
app.use('/api/group-urls', groupUrlsRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/logs', logsRoutes);

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

/**
 * Start the server
 * Logs server startup details, including the environment.
 */
app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});