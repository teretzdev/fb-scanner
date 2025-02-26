/**
 * background.js
 * Handles messaging and logging for the Chrome extension.
 * Includes enhanced error handling and detailed logs.
 */

const express = require('express');
const { log } = require('./logging/clientLogger');
const storage = require('./storage');

const router = express.Router();

// Route to handle monitoring requests
router.post('/monitor', async (req, res) => {
  try {
    const { groupUrls } = req.body;

    if (!Array.isArray(groupUrls) || groupUrls.length === 0) {
      log('warn', 'No group URLs provided for monitoring');
      return res.status(400).json({ success: false, message: 'No group URLs provided' });
    }

    log('info', `Received monitoring request for URLs: ${JSON.stringify(groupUrls)}`);
    await storage.saveGroupUrls(groupUrls);

    res.status(200).json({ success: true, message: 'Monitoring started' });
  } catch (error) {
    log('error', `Error in /monitor route: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;

const MONITOR_INTERVAL = 60000; // 1 minute
let monitorTimeout;

// Debounced function to monitor Facebook group URLs
async function monitorGroupUrls() {
  try {
    const groupUrls = await storage.getGroupUrls();
    if (!groupUrls || groupUrls.length === 0) {
      log('warn', 'No group URLs found for monitoring');
      return;
    }

    for (const url of groupUrls) {
      try {
        log('info', `Monitoring URL: ${url}`);
        // Add scanning logic here if needed
      } catch (error) {
        log('error', `Error processing URL ${url}: ${error.message}`);
      }
    }
  } catch (error) {
    log('error', `Error in monitorGroupUrls: ${error.message}`);
  }
}

/**
 * Retry mechanism for injecting content scripts into a tab.
 * This function attempts to inject the content script multiple times
 * in case of failures, and logs errors for each failed attempt.
 */
async function injectContentScriptWithRetry(tabId, url, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId, allFrames: true },
        files: ['content.js'],
      });
      log('info', `Content script injected into ${url}`);
      return;
    } catch (error) {
      log('error', `Attempt ${attempt} failed to inject content script into ${url}: ${error.message}`);
      if (attempt === retries) {
        log('error', `Failed to inject content script into ${url} after ${retries} attempts`);
        chrome.storage.local.get({ failedUrls: [] }, (data) => {
          const failedUrls = data.failedUrls || [];
          if (!failedUrls.includes(url)) {
            failedUrls.push(url);
            chrome.storage.local.set({ failedUrls }, () => {
              log('warn', `Added ${url} to failed URLs list for retry.`);
            });
          }
        });
      }
    }
  }
}

/**
 * Debounce wrapper to delay the execution of a function.
 * Ensures that the function is executed only after the specified delay
 * has passed since the last invocation.
 */
function debounce(func, delay) {
  return (...args) => {
    clearTimeout(monitorTimeout);
    monitorTimeout = setTimeout(() => func(...args), delay);
  };
}

// Start periodic monitoring with debouncing
const debouncedMonitorGroupUrls = debounce(monitorGroupUrls, MONITOR_INTERVAL);
debouncedMonitorGroupUrls();

/**
 * Listener for tab closure events.
 * Cleans up monitoring states associated with the closed tab
 * to ensure proper resource management.
 */
chrome.tabs.onRemoved.addListener((tabId) => {
  log('info', `Tab ${tabId} closed. Cleaning up monitoring states.`);
  chrome.storage.local.get({ monitoringStates: {} }, (data) => {
    const monitoringStates = data.monitoringStates || {};
    let updated = false;

    for (const url in monitoringStates) {
      if (monitoringStates[url] === tabId) {
        delete monitoringStates[url];
        updated = true;
        log('info', `Removed monitoring state for URL: ${url}`);
      }
    }

    if (updated) {
      chrome.storage.local.set({ monitoringStates }, () => {
        log('info', 'Monitoring states updated after tab closure.');
      });
    }
  });
});

/**
 * Log events when the service worker is installed or the extension starts up.
 * Provides visibility into the lifecycle of the extension.
 */
chrome.runtime.onInstalled.addListener(() => {
  log('info', 'Extension installed or updated');
});

chrome.runtime.onStartup.addListener(() => {
  log('info', 'Extension started');
});

/**
 * Global error handlers for uncaught exceptions and unhandled promise rejections.
 * Ensures that all unexpected errors are logged for debugging purposes.
 */
process.on('uncaughtException', (error) => {
  log('error', `Uncaught exception: ${error.message}`);
});

process.on('unhandledRejection', (reason) => {
  log('error', `Unhandled promise rejection: ${reason}`);
});