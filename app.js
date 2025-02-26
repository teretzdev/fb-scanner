/**
 * app.js
 * Entry point for the Facebook scanning application.
 * Initializes the Express server, sets up routes, and handles core application logic.
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