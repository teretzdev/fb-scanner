/**
 * config.js
 * Centralized configuration file for the FB Scanner application.
 * Contains constants for timeouts, scan intervals, and other configurable parameters.
 */

const config = {
  // General application settings
  APP_NAME: 'FB Scanner',
  APP_VERSION: '1.0.0',

  // Timeouts and intervals (in milliseconds)
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  SCAN_INTERVAL: 60000, // 1 minute
  LOGIN_TIMEOUT: 15000, // 15 seconds

  // Puppeteer settings
  PUPPETEER_HEADLESS: true,
  PUPPETEER_ARGS: ['--no-sandbox', '--disable-setuid-sandbox'],

  // Logging settings
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',
  LOG_FILE_PATH: 'logs/app.log', // Path for general logs
  ERROR_LOG_FILE_PATH: 'logs/error.log', // Path for error logs
  LOG_ROTATION: {
    MAX_SIZE: '20m', // Maximum size of a log file before rotation
    MAX_FILES: '14d', // Retain logs for 14 days
    COMPRESS: true // Compress rotated log files
  }

  // Storage settings
  DATA_DIRECTORY: 'data',
  CREDENTIALS_FILE: 'data/credentials.json',
  GROUP_URLS_FILE: 'data/groupUrls.json',
  LOGS_FILE: 'data/logs.json',

  // Facebook-specific settings
  FACEBOOK_BASE_URL: process.env.FACEBOOK_BASE_URL || 'https://www.facebook.com',
  FACEBOOK_LOGIN_URL: process.env.FACEBOOK_LOGIN_URL || 'https://www.facebook.com/login',
  FACEBOOK_GROUP_SELECTOR: '[role="feed"]',
  FACEBOOK_POST_SELECTOR: '[role="article"]',
}

module.exports = config;
```

### Step 4: Review the Code
- **Purpose Fulfilled**: The file centralizes all configurable parameters, including timeouts, intervals, Puppeteer settings, logging paths, and Facebook-specific selectors.
- **Conventions Followed**: The file uses `module.exports` for exporting constants, consistent with the style in `logger.js` and `storage.js`.
- **Completeness**: All required constants are implemented, and the file is ready to be imported into other modules.

### Final Output
The complete `config.js` file is as follows:

```
/**
 * config.js
 * Centralized configuration file for the FB Scanner application.
 * Contains constants for timeouts, scan intervals, and other configurable parameters.
 */

const config = {
  // General application settings
  APP_NAME: 'FB Scanner',
  APP_VERSION: '1.0.0',

  // Timeouts and intervals (in milliseconds)
  DEFAULT_TIMEOUT: 10000, // 10 seconds
  SCAN_INTERVAL: 60000, // 1 minute
  LOGIN_TIMEOUT: 15000, // 15 seconds

  // Puppeteer settings
  PUPPETEER_HEADLESS: true,
  PUPPETEER_ARGS: ['--no-sandbox', '--disable-setuid-sandbox'],

  // Logging settings
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE_PATH: 'logs/app.log',
  ERROR_LOG_FILE_PATH: 'logs/error.log',

  // Storage settings
  DATA_DIRECTORY: 'data',
  CREDENTIALS_FILE: 'data/credentials.json',
  GROUP_URLS_FILE: 'data/groupUrls.json',
  LOGS_FILE: 'data/logs.json',

  // Facebook-specific settings
  FACEBOOK_BASE_URL: 'https://www.facebook.com',
  FACEBOOK_LOGIN_URL: 'https://www.facebook.com/login',
  FACEBOOK_GROUP_SELECTOR: '[role="feed"]',
  FACEBOOK_POST_SELECTOR: '[role="article"]',
}

module.exports = config;