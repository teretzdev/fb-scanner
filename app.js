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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// Serve static files from the React frontend's build directory
app.use(express.static('frontend/build'));

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

// Catch-all route to serve React frontend
app.get('*', (req, res) => {
  res.sendFile('index.html', { root: 'frontend/build' });
});

// Start the server
app.listen(PORT, () => {
  serverLogger.info(`Server is running on http://localhost:${PORT}`);
});