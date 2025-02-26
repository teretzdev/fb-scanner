/**
 * background.js
 * Handles messaging and logging for the Chrome extension.
 * Includes enhanced error handling and detailed logs.
 */

const log = require('./logging/clientLogger').log;

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    log('info', `Received message: ${JSON.stringify(message)} from ${sender.url || 'unknown sender'}`);

    if (message.type === 'log') {
      // Log messages sent from content scripts or popup
      log('info', `Log from extension: ${message.payload}`);
      sendResponse({ status: 'success', message: 'Log received' });
    } else if (message.type === 'error') {
      // Handle error messages
      log('error', `Error reported: ${message.payload}`);
      sendResponse({ status: 'success', message: 'Error logged' });
    } else if (message.type === 'monitor') {
      // Handle monitor messages
      log('info', `Monitor message received with payload: ${JSON.stringify(message.payload)}`);
      sendResponse({ status: 'success', message: 'Monitor message processed' });
    } else {
      // Handle unknown message types
      log('warn', `Unknown message type: ${message.type}`);
      sendResponse({ status: 'error', message: 'Unknown message type' });
    }
  } catch (error) {
    log('error', `Exception in message handler: ${error.message}`);
    sendResponse({ status: 'error', message: 'Internal error occurred' });
  }

  // Indicate that the response will be sent asynchronously
  return true;
});

const MONITOR_INTERVAL = 60000; // 1 minute
let monitorTimeout;

// Debounced function to monitor Facebook group URLs
async function monitorGroupUrls() {
  try {
    const { groupUrls = [] } = await chrome.storage.local.get({ groupUrls: [] }).catch((error) => {
      log('error', `Failed to retrieve group URLs: ${error.message}`);
      throw error;
    });

    if (groupUrls.length === 0) {
      log('warn', 'No group URLs found for monitoring');
      return;
    }

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true }).catch((error) => {
      log('error', `Failed to query active tabs: ${error.message}`);
      throw error;
    });

    const activeTabUrls = tabs.map((tab) => tab.url);

    if (activeTabUrls.length === 0) {
      log('warn', 'No active tabs found in the current window');
    }

    for (const url of groupUrls) {
      try {
        const { monitoringStates = {} } = await chrome.storage.local.get({ monitoringStates: {} }).catch((error) => {
          log('error', `Failed to retrieve monitoring states: ${error.message}`);
          throw error;
        });

        const isMonitoringEnabled = monitoringStates[url] === true;

        if (isMonitoringEnabled) {
          const matchingTab = tabs.find((tab) => tab.url === url);
          if (matchingTab) {
            await injectContentScriptWithRetry(matchingTab.id, url);
          } else {
            log('warn', `No active tab matches the monitored URL: ${url}`);
          }
        } else {
          log('info', `Monitoring is disabled for URL: ${url}`);
        }
      } catch (error) {
        log('error', `Error processing URL ${url}: ${error.message}`);
      }
    }
  } catch (error) {
    log('error', `Unexpected error in monitorGroupUrls: ${error.message}`);
  }
}

// Retry mechanism for injecting content scripts
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

// Debounce wrapper
function debounce(func, delay) {
  return (...args) => {
    clearTimeout(monitorTimeout);
    monitorTimeout = setTimeout(() => func(...args), delay);
  };
}

// Start periodic monitoring with debouncing
const debouncedMonitorGroupUrls = debounce(monitorGroupUrls, MONITOR_INTERVAL);
debouncedMonitorGroupUrls();

// Cleanup monitoring states on tab close
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

// Log when the service worker is installed or activated
chrome.runtime.onInstalled.addListener(() => {
  log('info', 'Extension installed or updated');
});

chrome.runtime.onStartup.addListener(() => {
  log('info', 'Extension started');
});

// Handle uncaught exceptions in the background script
window.addEventListener('error', (event) => {
  log('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener('unhandledrejection', (event) => {
  log('error', `Unhandled promise rejection: ${event.reason}`);
});