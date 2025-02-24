/**
 * content.js
 * Interacts with Facebook pages and sends messages to the background script.
 * Includes detailed logging and error handling.
 */

/**
 * Utility function for logging messages with timestamps.
 * Logs messages at the specified level (e.g., 'info', 'error').
 */
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

  try {
    // Function to extract posts from the Facebook page
    function extractPosts() {
      const posts = document.querySelectorAll('[role="article"]');
      return Array.from(posts).map((post) => {
        const content = post.innerText || post.textContent;
        const timestamp = post.querySelector('abbr')?.getAttribute('title') || 'Unknown time';
        return { content, timestamp };
      });
    }
    logMessage('info', 'Interacting with the Facebook page...');

    // Extract the title of the page
    const pageTitle = document.title;
    logMessage('info', `Page title: ${pageTitle}`);

    // Extract posts from the page
    const extractedData = extractPosts();

    logMessage('info', `Extracted ${extractedData.length} posts from the page`);

    // Send the extracted data to the background script
    (async () => {
      try {
        const response = await sendMessageToBackground('monitor', { pageTitle, posts: extractedData });
        logMessage('info', `Background script response: ${JSON.stringify(response)}`);
      } catch (error) {
        logMessage('error', `Error sending extracted data to background script: ${error}`);
      }
    })();
    /**
     * Utility class for retrying failed operations with exponential backoff.
     */
    class RetryOperation {
      constructor(maxRetries = 3, delay = 1000) {
        this.maxRetries = maxRetries;
        this.delay = delay;
      }

      async execute(operation) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
          try {
            return await operation();
          } catch (error) {
            if (attempt === this.maxRetries) {
              throw error;
            }
            logMessage('warn', `Retry attempt ${attempt} failed. Retrying in ${this.delay}ms...`);
            await new Promise((resolve) => setTimeout(resolve, this.delay));
          }
        }
      }
    }

    /**
     * Utility function to throttle the execution of a callback.
     */
    function throttle(callback, limit) {
      let lastCall = 0;
      return (...args) => {
        const now = Date.now();
        if (now - lastCall >= limit) {
          lastCall = now;
          callback(...args);
        }
      };
    }

    // Set up a mutation observer to monitor changes in the DOM
    const observer = new MutationObserver(
      throttle(() => {
        try {
          const updatedData = extractPosts();
          logMessage('info', `Detected DOM changes. Extracted ${updatedData.length} posts.`);
          const retryOperation = new RetryOperation(3, 1000);
          retryOperation.execute(() =>
            sendMessageToBackground('monitor', { pageTitle, posts: updatedData })
          ).catch((error) => {
            logMessage('error', `Error sending updated data to background script: ${error}`);
          });
        } catch (error) {
          logMessage('error', `Error during DOM observation: ${error.message}`);
        }
      }, 2000) // Throttle DOM observation to once every 2 seconds
    );

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on script unload to prevent memory leaks
    window.addEventListener('beforeunload', () => {
      observer.disconnect();
      logMessage('info', 'MutationObserver disconnected to prevent memory leaks.');
    });
  } catch (error) {
    if (error instanceof TypeError) {
      logMessage('error', `TypeError encountered: ${error.message}`);
    } else if (error instanceof ReferenceError) {
      logMessage('error', `ReferenceError encountered: ${error.message}`);
    } else {
      logMessage('error', `Unexpected error: ${error.message}`);
    }
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