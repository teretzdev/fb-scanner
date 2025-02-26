/**
 * app.js
 * Entry point for the Facebook scanning application.
 * Initializes the Express server, sets up routes, and handles core application logic.
 */

const express = require('express');
const bodyParser = require('body-parser');
const serverLogger = require('./logging/serverLogger');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Middleware
 */

/**
 * Middleware
 */

// Add unique request ID to each request
app.use((req, res, next) => {
  req.id = uuidv4();
  next();
});

// Log incoming HTTP requests with additional metadata
app.use((req, res, next) => {
  serverLogger.info(`Incoming request: ${req.method} ${req.url}`, {
    requestId: req.id,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
    headers: req.headers,
    body: req.body,
  });
  next();
});

// Set security headers
app.use(helmet());

// Apply rate limiting to all requests
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
});
app.use(limiter);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.static('frontend/build'));

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/frontend/build/index.html');
});

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