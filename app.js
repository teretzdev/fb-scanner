/**
 * app.js
 * Entry point for the Facebook scanning application.
 * Initializes the Express server, sets up routes, and handles core application logic.
 */

const express = require('express');
const bodyParser = require('body-parser');
const serverLogger = require('./logging/serverLogger');
const cors = require('cors');

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

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const scanRoutes = require('./routes/scan');
const logsRoutes = require('./routes/logs');

// Routes
app.use('/api/scan', scanRoutes);
app.use('/api/logs', logsRoutes);

app.use((err, req, res, next) => {
  serverLogger.error(`Unhandled error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  serverLogger.info(`Server is running on http://localhost:${PORT}`);
  serverLogger.info('API routes mounted: /api/logs, /api/scan');
});