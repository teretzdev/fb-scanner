/**
 * content.js
 * Interacts with Facebook pages and sends messages to the background script.
 * Includes detailed logging and error handling.
 */

// Utility function for logging messages with timestamps
function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
}

// Function to send messages to the background script
function sendMessageToBackground(type, payload) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ type, payload }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

/**
 * Extracts posts from the Facebook page.
 * Queries [role="article"] elements and maps them to an array of objects with 'content' and 'timestamp'.
 */
function extractPosts() {
  const posts = document.querySelectorAll('[role="article"]');
  return Array.from(posts).map((post) => {
    const content = post.innerText || post.textContent;
    const timestamp = post.querySelector('abbr')?.getAttribute('title') || 'Unknown time';
    return { content, timestamp };
  });
}
  try {
    logMessage('info', 'Interacting with the Facebook page...');

    // Extract the title of the page
    const pageTitle = document.title;
    logMessage('info', `Page title: ${pageTitle}`);

    // Extract posts from the page
    const extractedData = extractPosts();

    logMessage('info', `Extracted ${extractedData.length} posts from the page`);

    // Send the extracted data to the background script
    sendMessageToBackground('monitor', { pageTitle, posts: extractedData })
      .then((response) => {
        logMessage('info', `Background script response: ${JSON.stringify(response)}`);
      })
      .catch((error) => {
        logMessage('error', `Error sending extracted data to background script: ${error}`);
      });
  } catch (error) {
    logMessage('error', `Error interacting with the Facebook page: ${error.message}`);
  }
}

// Handle uncaught exceptions
window.addEventListener('error', (event) => {
  logMessage('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
  sendMessageToBackground('error', `Uncaught error: ${event.message}`).catch((error) => {
    logMessage('error', `Failed to log uncaught error to background script: ${error}`);
  });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logMessage('error', `Unhandled promise rejection: ${event.reason}`);
  sendMessageToBackground('error', `Unhandled promise rejection: ${event.reason}`).catch((error) => {
    logMessage('error', `Failed to log unhandled rejection to background script: ${error}`);
  });
});

// Execute the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  logMessage('info', 'Content script loaded and DOM fully loaded');
  interactWithFacebookPage();
});
```

### Step 4: Review the Code
1. **Functionality**: The script interacts with Facebook pages, logs messages, and communicates with the background script as required.
2. **Error Handling**: Includes `try-catch` blocks and event listeners for uncaught errors and unhandled promise rejections.
3. **Logging**: Uses a utility function to log messages with timestamps.
4. **Conventions**: Follows the conventions and style used in the provided `background.js` file.
5. **Completeness**: The file is fully functional and does not include placeholders or incomplete code.

### Final Output
```
/**
 * content.js
 * Interacts with Facebook pages and sends messages to the background script.
 * Includes detailed logging and error handling.
 */

// Utility function for logging messages with timestamps
function logMessage(level, message) {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${message}`);
}

// Function to send messages to the background script
function sendMessageToBackground(type, payload) {
  return new Promise((resolve, reject) => {
    try {
      chrome.runtime.sendMessage({ type, payload }, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError.message);
        } else {
          resolve(response);
        }
      });
    } catch (error) {
      reject(error.message);
    }
  });
}

// Function to interact with the Facebook page
function interactWithFacebookPage() {
  try {
    logMessage('info', 'Interacting with the Facebook page...');

    // Extract the title of the page
    const pageTitle = document.title;
    logMessage('info', `Page title: ${pageTitle}`);

    // Monitor the page for new posts and comments
    const posts = document.querySelectorAll('[role="article"]');
    const extractedData = Array.from(posts).map((post) => {
      const content = post.innerText || post.textContent;
      const timestamp = post.querySelector('abbr')?.getAttribute('title') || 'Unknown time';
      return { content, timestamp };
    });

    logMessage('info', `Extracted ${extractedData.length} posts from the page`);

    // Send the extracted data to the background script
    sendMessageToBackground('monitor', { pageTitle, posts: extractedData })
      .then((response) => {
        logMessage('info', `Background script response: ${JSON.stringify(response)}`);
      })
      .catch((error) => {
        logMessage('error', `Error sending extracted data to background script: ${error}`);
      });
  } catch (error) {
    logMessage('error', `Error interacting with the Facebook page: ${error.message}`);
  }
}

// Handle uncaught exceptions
window.addEventListener('error', (event) => {
  logMessage('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
  sendMessageToBackground('error', `Uncaught error: ${event.message}`).catch((error) => {
    logMessage('error', `Failed to log uncaught error to background script: ${error}`);
  });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logMessage('error', `Unhandled promise rejection: ${event.reason}`);
  sendMessageToBackground('error', `Unhandled promise rejection: ${event.reason}`).catch((error) => {
    logMessage('error', `Failed to log unhandled rejection to background script: ${error}`);
  });
});

// Execute the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  logMessage('info', 'Content script loaded and DOM fully loaded');
  interactWithFacebookPage();
});