/**
 * routes/scan.js
 * Handles routes for initiating Facebook group scans and retrieving scan results.
 */

const express = require('express');
const router = express.Router();
const { scanUrl } = require('../scanner');
const storage = require('../storage');
const logger = require('../logger');
const { isValidUrl } = require('../utils');

// POST /api/scan - Initiate a scan for a Facebook group URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      logger.warn(`Invalid or missing URL in request body: ${url}`);
      return res.status(400).json({
        success: false,
        message: 'A valid URL (string) is required',
      });
    }

    logger.info(`Initiating scan for URL: ${url}`);

    // Perform the scan
    const scanResults = await scanUrl(url);

    // Save the scan results
    await storage.saveLog(`Scan completed for URL: ${url}`);
    logger.info(`Scan results saved for URL: ${url}`);

    res.status(200).json({
      success: true,
      message: 'Scan completed successfully',
      data: scanResults,
    });
  } catch (error) {
    logger.error(`Error during scan for URL ${req.body.url || 'unknown'}: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to complete the scan. Please try again later.',
    });
  }
});

// GET /api/scan - Retrieve all scan results
router.get('/', async (req, res) => {
  try {
    // Retrieve scan logs
    const logs = await storage.getLogs();

    logger.info(`Scan results retrieved successfully. Total logs: ${logs.length}`);
    res.status(200).json({
      success: true,
      message: 'Scan results retrieved successfully.',
      logs,
    });
  } catch (error) {
    logger.error(`Error retrieving scan results: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve scan results',
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    // Clear all scan logs
    await storage.clearLogs();

    logger.info('All scan logs cleared successfully');
    res.status(200).json({
      success: true,
      message: 'All scan logs cleared successfully',
    });
  } catch (error) {
    logger.error(`Error clearing scan logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to clear scan logs',
    });
  }
});

module.exports = router;