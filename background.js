/**
 * background.js
 * Handles messaging and logging for the Chrome extension.
 * Includes enhanced error handling and detailed logs.
 */

// Utility function for logging messages with timestamps
function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
}

// Listener for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    logMessage('info', `Received message: ${JSON.stringify(message)} from ${sender.url || 'unknown sender'}`);

    if (message.type === 'log') {
      // Log messages sent from content scripts or popup
      logMessage('info', `Log from extension: ${message.payload}`);
      sendResponse({ status: 'success', message: 'Log received' });
    } else if (message.type === 'error') {
      // Handle error messages
      logMessage('error', `Error reported: ${message.payload}`);
      sendResponse({ status: 'success', message: 'Error logged' });
    } else {
      // Handle unknown message types
      logMessage('warn', `Unknown message type: ${message.type}`);
      sendResponse({ status: 'error', message: 'Unknown message type' });
    }
  } catch (error) {
    logMessage('error', `Exception in message handler: ${error.message}`);
    sendResponse({ status: 'error', message: 'Internal error occurred' });
  }

  // Indicate that the response will be sent asynchronously
  return true;
});

const MONITOR_INTERVAL = 60000; // 1 minute

// Function to monitor Facebook group URLs
function monitorGroupUrls() {
  chrome.storage.local.get({ groupUrls: [] }, (data) => {
    const groupUrls = data.groupUrls || [];
    if (groupUrls.length === 0) {
      logMessage('warn', 'No group URLs found for monitoring');
      return;
    }

    groupUrls.forEach((url) => {
      try {
        chrome.scripting.executeScript(
          {
            target: { tabId: null, allFrames: true },
            files: ['content.js'],
          },
          () => {
            if (chrome.runtime.lastError) {
              logMessage('error', `Failed to inject content script into ${url}: ${chrome.runtime.lastError.message}`);
            } else {
              logMessage('info', `Content script injected into ${url}`);
            }
          }
        );
      } catch (error) {
        logMessage('error', `Error monitoring URL ${url}: ${error.message}`);
      }
    });
  });
}

// Start periodic monitoring
setInterval(monitorGroupUrls, MONITOR_INTERVAL);

// Log when the service worker is installed or activated
chrome.runtime.onInstalled.addListener(() => {
  logMessage('info', 'Extension installed or updated');
});

chrome.runtime.onStartup.addListener(() => {
  logMessage('info', 'Extension started');
});

// Handle uncaught exceptions in the background script
window.addEventListener('error', (event) => {
  logMessage('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
});

window.addEventListener('unhandledrejection', (event) => {
  logMessage('error', `Unhandled promise rejection: ${event.reason}`);
});