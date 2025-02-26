/**
 * routes/scan.js
 * Handles routes for initiating Facebook group scans and retrieving scan results.
 */

const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const storage = require('../storage');
const serverLogger = require('../logging/serverLogger');
const { isValidUrl } = require('../utils');

// POST /api/scan - Initiate a scan for a Facebook group URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      serverLogger.warn(`Invalid or missing URL in request body: ${url}`);
      return res.status(400).json({
        success: false,
        message: 'A valid URL (string) is required',
      });
    }

    serverLogger.info(`Initiating scan for URL: ${url}`);

    // Perform the scan
    // Launch Puppeteer and navigate to the URL
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle2' });

      // Extract dummy profile information
      const name = await page.evaluate(() => document.querySelector('h1')?.innerText || 'Unknown Name');
      const bio = await page.evaluate(() => document.querySelector('.bio')?.innerText || 'No bio available');
      const posts = await page.evaluate(() => {
        const postElements = document.querySelectorAll('.post');
        return Array.from(postElements).map((post) => ({
          content: post.innerText || 'No content',
          timestamp: post.querySelector('.timestamp')?.innerText || 'Unknown time',
        }));
      });

      const scanResults = { name, bio, posts };

      // Save the scan results
      await storage.saveLog(`Scan completed for URL: ${url}`);
      serverLogger.info(`Scan results saved for URL: ${url}`);

      res.status(200).json({
        success: true,
        message: 'Scan completed successfully',
        data: scanResults,
      });
    } catch (error) {
      serverLogger.error(`Error during Puppeteer operation for URL ${url}: ${error.message}`);
      res.status(500).json({
        success: false,
        message: 'Failed to complete the scan. Please try again later.',
      });
    } finally {
      await browser.close();
    }

    res.status(200).json({
      success: true,
      message: 'Scan completed successfully',
      data: scanResults,
    });
  } catch (error) {
    serverLogger.error(`Error during scan for URL ${req.body.url || 'unknown'}: ${error.message}`);
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

    serverLogger.info(`Scan results retrieved successfully. Total logs: ${logs.length}`);
    res.status(200).json({
      success: true,
      message: 'Scan results retrieved successfully.',
      logs,
    });
  } catch (error) {
    serverLogger.error(`Error retrieving scan results: ${error.message}`);
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

    serverLogger.info('All scan logs cleared successfully');
    res.status(200).json({
      success: true,
      message: 'All scan logs cleared successfully',
    });
  } catch (error) {
    serverLogger.error(`Error clearing scan logs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to clear scan logs',
    });
  }
});

module.exports = router;