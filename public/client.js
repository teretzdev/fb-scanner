/**
 * client.js
 * Handles user interactions in the web interface and communicates with the server-side API.
 * Manages credentials, group URLs, and logs.
 */

// Utility function for displaying messages in the logs section
function displayLog(message) {
  const logsContainer = document.getElementById('logs-container');
  const logEntry = document.createElement('div');
  logEntry.textContent = message;
  logsContainer.appendChild(logEntry);
  logsContainer.scrollTop = logsContainer.scrollHeight; // Auto-scroll to the latest log
}

// Utility function for making API requests
async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    displayLog(`Error: ${error.message}`);
    throw error;
  }
}

// Save Facebook credentials
async function saveCredentials(username, password) {
  try {
    displayLog('Saving credentials...');
    await apiRequest('/api/credentials', 'POST', { username, password });
    displayLog('Credentials saved successfully.');
  } catch (error) {
    displayLog(`Error saving credentials: ${error.message}`);
  }
}

// Add a group URL
async function addGroupUrl(url) {
  try {
    displayLog('Adding group URL...');
    const response = await apiRequest('/api/group-urls', 'POST', { url });
    updateGroupUrlList(response.groupUrls);
    displayLog('Group URL added successfully.');
  } catch (error) {
    displayLog(`Error adding group URL: ${error.message}`);
  }
}

// Load group URLs
async function loadGroupUrls() {
  try {
    displayLog('Loading group URLs...');
    const response = await apiRequest('/api/group-urls');
    updateGroupUrlList(response.groupUrls);
    displayLog('Group URLs loaded successfully.');
  } catch (error) {
    displayLog(`Error loading group URLs: ${error.message}`);
  }
}

// Start scanning a group URL
async function startScanning(url) {
  try {
    displayLog(`Starting scan for URL: ${url}...`);
    const response = await apiRequest('/api/scan', 'POST', { url });
    displayLog(`Scan completed. Extracted data: ${JSON.stringify(response.data)}`);
  } catch (error) {
    displayLog(`Error scanning URL: ${error.message}`);
  }
}

// Load logs
async function loadLogs() {
  try {
    displayLog('Loading logs...');
    const response = await apiRequest('/api/logs');
    const logsContainer = document.getElementById('logs-container');
    logsContainer.innerHTML = ''; // Clear existing logs
    response.logs.forEach((log) => {
      const logEntry = document.createElement('div');
      logEntry.textContent = `[${log.timestamp}] ${log.message}`;
      logsContainer.appendChild(logEntry);
    });
    displayLog('Logs loaded successfully.');
  } catch (error) {
    displayLog(`Error loading logs: ${error.message}`);
  }
}

// Update the group URL list in the UI
function updateGroupUrlList(groupUrls) {
  const groupUrlList = document.getElementById('group-url-list');
  groupUrlList.innerHTML = ''; // Clear the list

  groupUrls.forEach((url) => {
    const listItem = document.createElement('li');
    listItem.textContent = url;

    const scanButton = document.createElement('button');
    scanButton.textContent = 'Scan';
    scanButton.addEventListener('click', () => startScanning(url));

    listItem.appendChild(scanButton);
    groupUrlList.appendChild(listItem);
  });
}

// Initialize the web interface
function initializeInterface() {
  // Handle credentials form submission
  const credentialsForm = document.getElementById('credentials-form');
  credentialsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    saveCredentials(username, password);
  });

  // Handle adding a group URL
  const addGroupUrlButton = document.getElementById('add-group-url');
  addGroupUrlButton.addEventListener('click', () => {
    const groupUrlInput = document.getElementById('group-url');
    const groupUrl = groupUrlInput.value;
    if (!groupUrl) {
      displayLog('Error: Group URL cannot be empty.');
      return;
    }
    addGroupUrl(groupUrl);
    groupUrlInput.value = ''; // Clear the input field
  });

  // Handle clearing logs
  const clearLogsButton = document.getElementById('clear-logs');
  clearLogsButton.addEventListener('click', () => {
    const logsContainer = document.getElementById('logs-container');
    logsContainer.innerHTML = ''; // Clear logs in the UI
    displayLog('Logs cleared.');
  });

  // Load initial data
  loadGroupUrls();
  loadLogs();
}

// Initialize the interface when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeInterface);
