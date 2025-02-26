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
    if (!url || !isValidUrl(url)) {
      logger.warn('Invalid or missing URL in request body');
      return res.status(400).json({
        success: false,
        message: 'A valid URL is required',
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
    logger.error(`Error during scan: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to complete the scan',
    });
  }
});

// GET /api/scan - Retrieve all scan results
router.get('/', async (req, res) => {
  try {
    // Retrieve scan logs
    const logs = await storage.getLogs();

    logger.info('Scan results retrieved successfully');
    res.status(200).json({
      success: true,
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

module.exports = router;
