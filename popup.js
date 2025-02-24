/**
 * popup.js
 * Handles the logic for the popup interface, including saving credentials, managing URLs, and displaying logs.
 * Includes detailed logging and error handling.
 */

// Utility function for logging messages with timestamps
function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
}

// Save Facebook credentials to Chrome storage
// TODO: Consider encrypting credentials before storing them for enhanced security.
function saveCredentials(username, password) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.set({ username, password }, () => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          logMessage('info', 'Credentials saved successfully');
          resolve();
        }
      });
    } catch (error) {
      logMessage('error', `Error saving credentials: ${error.message}`);
      reject(error.message);
    }
  });
}

// Add a group URL to Chrome storage
function addGroupUrl(url) {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get({ groupUrls: [] }, (data) => {
        const groupUrls = data.groupUrls || [];
        if (!groupUrls.includes(url)) {
          groupUrls.push(url);
          chrome.storage.local.set({ groupUrls }, () => {
            if (chrome.runtime.lastError) {
              reject(chrome.runtime.lastError.message);
            } else {
              logMessage('info', `Group URL added: ${url}`);
              resolve(groupUrls);
            }
          });
        } else {
          logMessage('warn', `Group URL already exists: ${url}`);
          resolve(groupUrls);
        }
      });
    } catch (error) {
      logMessage('error', `Error adding group URL: ${error.message}`);
      reject(error.message);
    }
  });
}

// Load group URLs from Chrome storage
function loadGroupUrls() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get({ groupUrls: [] }, (data) => {
        resolve(data.groupUrls || []);
      });
    } catch (error) {
      logMessage('error', `Error loading group URLs: ${error.message}`);
      reject(error.message);
    }
  });
}

// Clear logs from the logs container
function clearLogs() {
  const logsContainer = document.getElementById('logs-container');
  logsContainer.innerHTML = '';
  logMessage('info', 'Logs cleared');
}

// Populate the logs container with messages
// TODO: Consider adding user notifications (e.g., toast messages) for better feedback on actions.
function displayLog(message) {
  const logsContainer = document.getElementById('logs-container');
  const logEntry = document.createElement('div');
  logEntry.textContent = message;
  logsContainer.appendChild(logEntry);
}

// Initialize the popup interface
function initializePopup() {
  // Handle credentials form submission
  const credentialsForm = document.getElementById('credentials-form');
  credentialsForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission from reloading the page.
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    saveCredentials(username, password)
      .then(() => displayLog('Credentials saved successfully')) // Log success message.
      .catch((error) => displayLog(`Error saving credentials: ${error}`)); // Log error message.
  });

  // Handle adding a group URL
  const addGroupUrlButton = document.getElementById('add-group-url');
  addGroupUrlButton.addEventListener('click', () => {
    const groupUrlInput = document.getElementById('group-url');
    const groupUrl = groupUrlInput.value;

    if (groupUrl) {
      addGroupUrl(groupUrl)
        .then((groupUrls) => {
          displayLog(`Group URL added: ${groupUrl}`);
          updateGroupUrlList(groupUrls);
        })
        .catch((error) => displayLog(`Error adding group URL: ${error}`));
    } else {
      displayLog('Please enter a valid group URL');
    }
  });

  // Handle clearing logs
  const clearLogsButton = document.getElementById('clear-logs');
  clearLogsButton.addEventListener('click', clearLogs);

  // Load and display group URLs
  loadGroupUrls()
    .then((groupUrls) => updateGroupUrlList(groupUrls))
    .catch((error) => displayLog(`Error loading group URLs: ${error}`));
}

// Update the group URL list in the popup
function updateGroupUrlList(groupUrls) {
  const groupUrlList = document.getElementById('group-url-list');
  groupUrlList.innerHTML = ''; // Clear the list

  groupUrls.forEach((url) => {
    const listItem = document.createElement('li');
    listItem.textContent = url;

    // Create a container for the URL and controls
    const container = document.createElement('div');
    container.className = 'group-url-container';

    // Create a span for the URL
    const urlSpan = document.createElement('span');
    urlSpan.textContent = url;
    container.appendChild(urlSpan);

    // Create a button to toggle monitoring
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Enable Monitoring';
    toggleButton.className = 'toggle-monitoring';
    container.appendChild(toggleButton);

    // Create a span to display the monitoring status
    const statusSpan = document.createElement('span');
    statusSpan.className = 'monitoring-status';
    statusSpan.textContent = 'Paused';
    container.appendChild(statusSpan);

    // Append the container to the list item
    listItem.appendChild(container);
    groupUrlList.appendChild(listItem);

    // Load the current monitoring state from storage
    chrome.storage.local.get({ monitoringStates: {} }, (data) => {
      const monitoringStates = data.monitoringStates || {};
      if (monitoringStates[url]) {
        toggleButton.textContent = 'Disable Monitoring';
        statusSpan.textContent = 'Monitoring';
      }
    });

    // Add event listener to toggle monitoring
    toggleButton.addEventListener('click', () => {
      chrome.storage.local.get({ monitoringStates: {} }, (data) => {
        const monitoringStates = data.monitoringStates || {};
        const isMonitoring = monitoringStates[url];

        // Toggle the monitoring state
        monitoringStates[url] = !isMonitoring;
        chrome.storage.local.set({ monitoringStates }, () => {
          if (monitoringStates[url]) {
            toggleButton.textContent = 'Disable Monitoring';
            statusSpan.textContent = 'Monitoring';
          } else {
            toggleButton.textContent = 'Enable Monitoring';
            statusSpan.textContent = 'Paused';
          }
        });
      });
    });
  });

  logMessage('info', 'Group URL list updated');
}

// Initialize the popup when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  logMessage('info', 'Popup script loaded and DOM fully loaded');
  initializePopup();
});