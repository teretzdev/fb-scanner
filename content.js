/**
 * content.js
 * Interacts with Facebook pages and sends messages to the background script.
 * Includes detailed logging and error handling.
 */

const { log } = require('./logging/clientLogger');

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

function extractPosts() {
  const posts = document.querySelectorAll('[role="article"]');
  return Array.from(posts).map((post) => {
    const content = post.innerText || post.textContent;
    const timestamp = post.querySelector('abbr')?.getAttribute('title') || 'Unknown time';
    return { content, timestamp };
  });
}

function interactWithFacebookPage() {
  try {
    log('info', 'Interacting with the Facebook page...');

    // Extract the title of the page
    const pageTitle = document.title;
    log('info', `Page title: ${pageTitle}`);

    // Extract posts from the page
    const extractedData = extractPosts();

    log('info', `Extracted ${extractedData.length} posts from the page`);

    // Send the extracted data to the background script
    (async () => {
      try {
        const response = await sendMessageToBackground('monitor', { pageTitle, posts: extractedData });
        log('info', `Background script response: ${JSON.stringify(response)}`);
      } catch (error) {
        log('error', `Error sending extracted data to background script: ${error}`);
      }
    })();
  } catch (error) {
    if (error instanceof TypeError) {
      log('error', `TypeError encountered: ${error.message}`);
    } else if (error instanceof ReferenceError) {
      log('error', `ReferenceError encountered: ${error.message}`);
    } else {
      log('error', `Unexpected error: ${error.message}`);
    }
  }

  // Set up a mutation observer to monitor changes in the DOM
  const observer = new MutationObserver(() => {
    try {
      const updatedData = extractPosts();
      log('info', `Detected DOM changes. Extracted ${updatedData.length} posts.`);
      sendMessageToBackground('monitor', { pageTitle, posts: updatedData }).catch((error) => {
        log('error', `Error sending updated data to background script: ${error}`);
      });
    } catch (error) {
      log('error', `Error during DOM observation: ${error.message}`);
    }
  });

  // Start observing the body for changes
  observer.observe(document.body, { childList: true, subtree: true });
}

// Handle uncaught exceptions
window.addEventListener('error', (event) => {
  log('error', `Uncaught error: ${event.message} at ${event.filename}:${event.lineno}:${event.colno}`);
  sendMessageToBackground('error', `Uncaught error: ${event.message}`).catch((error) => {
    log('error', `Failed to log uncaught error to background script: ${error}`);
  });
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  log('error', `Unhandled promise rejection: ${event.reason}`);
  sendMessageToBackground('error', `Unhandled promise rejection: ${event.reason}`).catch((error) => {
    log('error', `Failed to log unhandled rejection to background script: ${error}`);
  });
});

// Execute the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  log('info', 'Content script loaded and DOM fully loaded');
  interactWithFacebookPage();
});