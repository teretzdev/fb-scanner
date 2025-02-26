/**
 * routes/scan.js
 * Handles routes for initiating Facebook profile scans and retrieving scan results.
 */

const express = require('express');
const router = express.Router();
const { scanProfile } = require('../services/facebookService');
const storage = require('../storage');
const serverLogger = require('../logging/serverLogger');
const validator = require('validator');

// POST /api/scan - Initiate a scan for a Facebook profile URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string' || !validator.isURL(url)) {
      serverLogger.warn(`Invalid or missing URL in request body: ${url}`);
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_URL',
        message: 'A valid URL (string) is required',
      });
    }

    serverLogger.info(`Initiating profile scan for URL: ${url}`);

    // Perform the scan
    const profileDetails = await scanProfile(url);

    // Save the scan results
    await storage.saveLog(`Profile scan completed for URL: ${url}`);
    serverLogger.info(`Profile scan results saved for URL: ${url}`);

    res.status(200).json({
      success: true,
      message: 'Profile scan completed successfully',
      data: profileDetails,
    });
  } catch (error) {
    serverLogger.error(`Error during profile scan for URL ${req.body.url || 'unknown'}: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      errorCode: 'SCAN_ERROR',
      message: 'Failed to complete the profile scan. Please try again later.',
    });
  }
});

// GET /api/scan - Retrieve all scan logs
router.get('/', async (req, res) => {
  try {
    // Retrieve scan logs
    const logs = await storage.getLogs();

    serverLogger.info(`Scan logs retrieved successfully. Total logs: ${logs.length}`);
    res.status(200).json({
      success: true,
      message: 'Scan logs retrieved successfully.',
      logs,
    });
  } catch (error) {
    serverLogger.error(`Error retrieving scan logs: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      errorCode: 'LOGS_RETRIEVAL_ERROR',
      message: 'Failed to retrieve scan logs',
    });
  }
});

// DELETE /api/scan - Clear all scan logs
router.delete('/', async (req, res) => {
  try {
    // Clear all scan logs
    await storage.clearLogs();

    serverLogger.info('All scan logs cleared successfully');
    res.status(200).json({
      success: true,
      message: 'All scan logs cleared successfully',
    });
  } catch (error) {
    serverLogger.error(`Error clearing scan logs: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      success: false,
      errorCode: 'LOGS_CLEAR_ERROR',
      message: 'Failed to clear scan logs',
    });
  }
});

module.exports = router;