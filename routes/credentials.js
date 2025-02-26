/**
 * routes/credentials.js
 * Handles routes for managing Facebook credentials, including saving and retrieving credentials.
 */

const express = require('express');
const router = express.Router();
const storage = require('../storage');
const serverLogger = require('../logging/serverLogger');

// POST /api/credentials - Save Facebook credentials
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      serverLogger.warn('Missing username or password in request body');
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    // Save credentials using storage module
    await storage.saveCredentials(username, password);
    serverLogger.info('Facebook credentials saved successfully');

    res.status(200).json({
      success: true,
      message: 'Credentials saved successfully',
    });
  } catch (error) {
    serverLogger.error(`Error saving credentials: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to save credentials',
    });
  }
});

<<<< UPDATED
// GET /api/credentials - Retrieve Facebook credentials

/**
 * DELETE /api/credentials - Delete Facebook credentials
 */
router.delete('/', async (req, res) => {
  try {
    // Delete credentials using storage module
    await storage.deleteCredentials();
    serverLogger.info('Facebook credentials deleted successfully');

    res.status(200).json({
      success: true,
      message: 'Credentials deleted successfully',
    });
  } catch (error) {
    serverLogger.error(`Error deleting credentials: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to delete credentials',
    });
  }
});

module.exports = router;