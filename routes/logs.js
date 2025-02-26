/**
 * routes/logs.js
 * Handles routes for managing application logs, including retrieving and clearing logs.
 */

const express = require('express');
const router = express.Router();
const storage = require('../storage');
const logger = require('../logger');

// GET /api/logs - Retrieve all logs
router.get('/', async (req, res) => {
  try {
    // Retrieve logs using the storage module
    const logs = await storage.getLogs();

    logger.info('Logs retrieved successfully');
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.error(`Error retrieving logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve logs',
    });
  }
});

// DELETE /api/logs - Clear all logs
router.delete('/', async (req, res) => {
  try {
    // Clear logs by overwriting the logs file with an empty array
    await storage.saveLog([]); // Pass an empty array to clear logs

    logger.info('Logs cleared successfully');
    res.status(200).json({
      success: true,
      message: 'Logs cleared successfully',
    });
  } catch (error) {
    logger.error(`Error clearing logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to clear logs',
    });
  }
});

module.exports = router;
```

### Step 4: Review the Code
- **Purpose Fulfilled**: The file implements routes for retrieving and clearing logs.
- **Conventions Followed**: The code uses `express` for routing, `storage.js` for data persistence, and `logger.js` for logging, consistent with the codebase.
- **Error Handling**: Proper error handling is implemented for both routes.
- **Completeness**: The file is fully functional and ready to be integrated into the application.

### Final Output
The complete `routes/logs.js` file is as follows:

```
/**
 * routes/logs.js
 * Handles routes for managing application logs, including retrieving and clearing logs.
 */

const express = require('express');
const router = express.Router();
const storage = require('../storage');
const logger = require('../logger');

// GET /api/logs - Retrieve all logs
router.get('/', async (req, res) => {
  try {
    // Retrieve logs using the storage module
    const logs = await storage.getLogs();

    logger.info('Logs retrieved successfully');
    res.status(200).json({
      success: true,
      logs,
    });
  } catch (error) {
    logger.error(`Error retrieving logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve logs',
    });
  }
});

// DELETE /api/logs - Clear all logs
router.delete('/', async (req, res) => {
  try {
    // Clear logs by overwriting the logs file with an empty array
    await storage.saveLog([]); // Pass an empty array to clear logs

    logger.info('Logs cleared successfully');
    res.status(200).json({
      success: true,
      message: 'Logs cleared successfully',
    });
  } catch (error) {
    logger.error(`Error clearing logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to clear logs',
    });
  }
});

module.exports = router;
