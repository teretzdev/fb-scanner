/**
 * background.js
 * Handles messaging and logging for the Chrome extension.
 * Includes enhanced error handling and detailed logs.
 */

const { log } = require('./logging/clientLogger');
const { getGroupUrls } = require('./storage');

// Monitor Facebook group URLs periodically
async function monitorGroupUrls() {
  try {
    const groupUrls = await getGroupUrls();
    if (groupUrls.length === 0) {
      log('warn', 'No group URLs found for monitoring');
      return;
    }

    for (const url of groupUrls) {
      log('info', `Monitoring URL: ${url}`);
      // Placeholder for processing the URL (e.g., scraping or checking status)
      await processUrl(url);
    }
  } catch (error) {
    log('error', `Error in monitorGroupUrls: ${error.message}`);
  }
}

// Placeholder function for processing a URL
async function processUrl(url) {
  try {
    log('info', `Processing URL: ${url}`);
    // Simulate some asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    log('info', `Finished processing URL: ${url}`);
  } catch (error) {
    log('error', `Error processing URL ${url}: ${error.message}`);
  }
}

// Start periodic monitoring
const MONITOR_INTERVAL = 60000; // 1 minute
setInterval(monitorGroupUrls, MONITOR_INTERVAL);



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
window.addEventListener('error', (event) => {
  log('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener('unhandledrejection', (event) => {
  log('error', `Unhandled promise rejection: ${event.reason}`);
});