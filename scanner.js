/**
 * scanner.js
 * Handles the Facebook scanning logic using Puppeteer.
 * Automates browser interactions to extract posts and comments from Facebook groups.
 */

const puppeteer = require('puppeteer');
const logger = require('./logger');
const storage = require('./storage');
const config = require('./config');

/**
 * Scans a Facebook group URL and extracts posts and comments.
 * @param {string} url - The Facebook group URL to scan.
 * @returns {Promise<Object>} - An object containing the extracted posts and comments.
 */
async function scanUrl(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided for scanning');
  }

  logger.info(`Starting scan for URL: ${url}`);

  let browser;
  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: config.PUPPETEER_HEADLESS,
      args: config.PUPPETEER_ARGS,
    });

    const page = await browser.newPage();

    // Set user agent to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Navigate to the Facebook group URL
    await page.goto(url, { waitUntil: 'networkidle2' });

    logger.info(`Navigated to URL: ${url}`);
    logger.debug('Waiting for login form to load...');

    // Log in to Facebook using stored credentials
    const credentials = await storage.getCredentials();
    if (!credentials || !credentials.username || !credentials.password) {
      throw new Error('Facebook credentials are missing');
    }

    logger.debug('Filling in login credentials...');
    await page.type('#email', credentials.username, { delay: 100 });
    await page.type('#pass', credentials.password, { delay: 100 });
    logger.debug('Clicking the login button...');
    await page.click('[name="login"]');

    // Wait for navigation after login
    logger.debug('Waiting for navigation after login...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    logger.info('Logged in to Facebook successfully');

    // Wait for the group page to load
    logger.debug(`Waiting for group page to load using selector: ${config.FACEBOOK_GROUP_SELECTOR}`);
    await page.waitForSelector(config.FACEBOOK_GROUP_SELECTOR, { timeout: config.DEFAULT_TIMEOUT });

    // Extract posts and comments from the group
    logger.debug('Extracting posts and comments from the group page...');
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('[role="article"], div[data-pagelet^="FeedUnit_"]');
      return Array.from(postElements).map((post) => {
        const content = post.innerText || post.textContent;
        const timestamp = post.querySelector('abbr, time')?.getAttribute('title') || 'Unknown time';
        const author = post.querySelector('[role="link"]')?.innerText || 'Unknown author';
        const reactions = post.querySelector('[aria-label*="reactions"]')?.getAttribute('aria-label') || 'No reactions';
        
        // Extract comments
        const commentElements = post.querySelectorAll('[aria-label="Comment"]');
        const comments = Array.from(commentElements).map((comment) => {
          const commentText = comment.innerText || comment.textContent;
          const commenter = comment.querySelector('[role="link"]')?.innerText || 'Unknown commenter';
          return { commenter, commentText };
        });

        return { content, timestamp, author, reactions, comments };
      });
    });

    logger.info(`Extracted ${posts.length} posts from the group`);
    posts.forEach((post, index) => {
      logger.debug(`Post ${index + 1}: ${post.content.substring(0, 50)}... (${post.comments.length} comments)`);
    });

    // Return the extracted posts and comments
    return { posts };
  } catch (error) {
    logger.error(`Error during scanning: ${error.message}`, { stack: error.stack });
    throw new Error(`Failed to scan URL: ${error.message}. URL: ${url}`);
  } finally {
    if (browser) {
      await browser.close();
      logger.info('Browser closed successfully');
    }
  }
}

module.exports = {
  scanUrl,
};