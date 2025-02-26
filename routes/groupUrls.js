/**
 * routes/groupUrls.js
 * Handles routes for managing Facebook group URLs, including adding, retrieving, and removing URLs.
 */

const express = require('express');
const router = express.Router();
const storage = require('../storage');
const logger = require('../logger');
const { isValidUrl } = require('../utils');

// POST /api/group-urls - Add a new group URL
router.post('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      logger.warn('Invalid or missing URL in request body');
      return res.status(400).json({
        success: false,
        message: 'A valid URL is required',
      });
    }

    // Add the group URL using the storage module
    const groupUrls = await storage.addGroupUrl(url);
    logger.info(`Group URL added successfully: ${url}`);

    res.status(200).json({
      success: true,
      message: 'Group URL added successfully',
      groupUrls,
    });
  } catch (error) {
    logger.error(`Error adding group URL: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to add group URL',
    });
  }
});

// GET /api/group-urls - Retrieve all group URLs
router.get('/', async (req, res) => {
  try {
    // Retrieve group URLs using the storage module
    const groupUrls = await storage.getGroupUrls();

    logger.info('Group URLs retrieved successfully');
    res.status(200).json({
      success: true,
      groupUrls,
    });
  } catch (error) {
    logger.error(`Error retrieving group URLs: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve group URLs',
    });
  }
});

// DELETE /api/group-urls - Remove a group URL
router.delete('/', async (req, res) => {
  try {
    const { url } = req.body;

    // Validate input
    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      logger.warn(`Invalid or missing URL in DELETE request: ${url}`);
      return res.status(400).json({
        success: false,
        message: 'A valid URL (string) is required for deletion',
      });
    }

    try {
      // Retrieve current group URLs
      const groupUrls = await storage.getGroupUrls();

      // Check if the URL exists in the list
      if (!groupUrls.includes(url)) {
        logger.warn(`Group URL not found: ${url}`);
        return res.status(404).json({
          success: false,
          message: 'Group URL not found in the list',
          groupUrls,
        });
      }

      // Remove the URL and update the storage
      const updatedGroupUrls = groupUrls.filter((groupUrl) => groupUrl !== url);
      await storage.saveGroupUrls(updatedGroupUrls);

      logger.info(`Group URL removed successfully: ${url}`);
      return res.status(200).json({
        success: true,
        message: 'Group URL removed successfully',
        groupUrls: updatedGroupUrls,
      });
    } catch (error) {
      logger.error(`Error removing group URL: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while removing the group URL',
      });
    }
  } catch (error) {
    logger.error(`Error removing group URL: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to remove group URL',
    });
  }
});

module.exports = router;