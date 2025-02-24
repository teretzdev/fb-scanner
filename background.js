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

class MessageQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(message, sender, sendResponse) {
    this.queue.push({ message, sender, sendResponse });
    this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const { message, sender, sendResponse } = this.queue.shift();

    try {
      logMessage('info', `Processing message: ${JSON.stringify(message)} from ${sender.url || 'unknown sender'}`);

      if (message.type === 'log') {
        logMessage('info', `Log from extension: ${message.payload}`);
        sendResponse({ status: 'success', message: 'Log received' });
      } else if (message.type === 'error') {
        logMessage('error', `Error reported: ${message.payload}`);
        sendResponse({ status: 'success', message: 'Error logged' });
      } else if (message.type === 'monitor') {
        logMessage('info', `Monitor message received with payload: ${JSON.stringify(message.payload)}`);
        sendResponse({ status: 'success', message: 'Monitor message processed' });
      } else {
        logMessage('warn', `Unknown message type: ${message.type}`);
        sendResponse({ status: 'error', message: 'Unknown message type' });
      }
    } catch (error) {
      logMessage('error', `Exception in message handler: ${error.message}`);
      sendResponse({ status: 'error', message: 'Internal error occurred' });
    } finally {
      this.isProcessing = false;
      this.processQueue();
    }
  }
}

const messageQueue = new MessageQueue();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  messageQueue.enqueue(message, sender, sendResponse);
});

const MONITOR_INTERVAL = 60000; // 1 minute
let monitorTimeout;

// Debounced function to monitor Facebook group URLs
async function monitorGroupUrls() {
  try {
    const { groupUrls = [] } = await chrome.storage.local.get({ groupUrls: [] });
    if (groupUrls.length === 0) {
      logMessage('warn', 'No group URLs found for monitoring');
      return;
    }

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTabUrls = tabs.map((tab) => tab.url);

    if (activeTabUrls.length === 0) {
      logMessage('warn', 'No active tabs found in the current window');
    }

    for (const url of groupUrls) {
      const { monitoringStates = {} } = await chrome.storage.local.get({ monitoringStates: {} });
      const isMonitoringEnabled = monitoringStates[url];

      if (isMonitoringEnabled) {
        const matchingTab = tabs.find((tab) => tab.url === url);
        if (matchingTab) {
          await injectContentScriptWithRetry(matchingTab.id, url);
        } else {
          logMessage('warn', `No active tab matches the monitored URL: ${url}`);
        }
      }
    }
  } catch (error) {
    logMessage('error', `Error in monitorGroupUrls: ${error.message}`);
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
      logMessage('info', `Content script injected into ${url}`);
      return;
    } catch (error) {
      logMessage('error', `Attempt ${attempt} failed to inject content script into ${url}: ${error.message}`);
      if (attempt === retries) {
        logMessage('error', `Failed to inject content script into ${url} after ${retries} attempts`);
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

function performHealthCheck() {
  chrome.storage.local.get({ groupUrls: [] }, async ({ groupUrls }) => {
    const tabs = await chrome.tabs.query({});
    const activeTabIds = tabs.map((tab) => tab.id);

    chrome.storage.local.get({ monitoringStates: {} }, ({ monitoringStates }) => {
      for (const [url, tabId] of Object.entries(monitoringStates)) {
        if (!activeTabIds.includes(tabId)) {
          logMessage('warn', `Tab ${tabId} for URL ${url} is no longer active. Attempting recovery.`);
          delete monitoringStates[url];
        }
      }
      chrome.storage.local.set({ monitoringStates });
    });
  });
}

const debouncedMonitorGroupUrls = debounce(monitorGroupUrls, MONITOR_INTERVAL);
debouncedMonitorGroupUrls();
setInterval(performHealthCheck, MONITOR_INTERVAL);

function cleanupResources() {
  logMessage('info', 'Cleaning up resources on extension unload.');
  clearInterval(monitorTimeout);
  chrome.tabs.onRemoved.removeListener(cleanupMonitoringStates);
}

function cleanupMonitoringStates(tabId) {
  logMessage('info', `Tab ${tabId} closed. Cleaning up monitoring states.`);
  chrome.storage.local.get({ monitoringStates: {} }, (data) => {
    const monitoringStates = data.monitoringStates || {};
    for (const url in monitoringStates) {
      if (monitoringStates[url] === tabId) {
        delete monitoringStates[url];
      }
    }
    chrome.storage.local.set({ monitoringStates });
  });
}

chrome.tabs.onRemoved.addListener(cleanupMonitoringStates);
chrome.runtime.onSuspend.addListener(cleanupResources);

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