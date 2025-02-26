/**
 * scanner.js
 * Handles the Facebook scanning logic using Puppeteer.
 * Automates browser interactions to extract posts and comments from Facebook groups.
 */

const puppeteer = require('puppeteer');
const logger = require('./logging/serverLogger');
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

  logger.info(`Initiating scan for URL: ${url}`, { url });

  let browser;
  try {
    // Launch Puppeteer browser
    logger.debug('Launching Puppeteer browser', {
      headless: config.PUPPETEER_HEADLESS,
      args: config.PUPPETEER_ARGS,
    });
    browser = await puppeteer.launch({
      headless: config.PUPPETEER_HEADLESS,
      args: config.PUPPETEER_ARGS,
    });
    logger.info('Puppeteer browser launched successfully');

    const page = await browser.newPage();

    // Set user agent to mimic a real browser
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    );

    // Navigate to the Facebook group URL
    logger.debug(`Navigating to URL: ${url}`, { url });
    await page.goto(url, { waitUntil: 'networkidle2' });
    logger.info(`Successfully navigated to URL: ${url}`);

    // Log in to Facebook using stored credentials
    logger.debug('Retrieving Facebook credentials from storage');
    const credentials = await storage.getCredentials();
    if (!credentials || !credentials.username || !credentials.password) {
      logger.error('Facebook credentials are missing');
      throw new Error('Facebook credentials are missing');
    }

    logger.debug('Typing Facebook credentials into login form');
    await page.type('#email', credentials.username, { delay: 100 });
    await page.type('#pass', credentials.password, { delay: 100 });
    await page.click('[name="login"]');

    logger.debug('Waiting for navigation after login');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    logger.info('Successfully logged in to Facebook');

    // Wait for the group page to load
    await page.waitForSelector(config.FACEBOOK_GROUP_SELECTOR, { timeout: config.DEFAULT_TIMEOUT });

    // Extract posts and comments from the group
    logger.debug('Extracting posts and comments from the group page');
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

    logger.info(`Successfully extracted ${posts.length} posts and their comments`, { postCount: posts.length });

    // Return the extracted posts and comments
    return { posts };
  } catch (error) {
    logger.error(`Error during scanning`, {
      message: error.message,
      stack: error.stack,
      url,
    });
    throw new Error(`Failed to scan URL: ${error.message}. URL: ${url}`);
  } finally {
    if (browser) {
      await browser.close();
      logger.info('Puppeteer browser closed successfully');
    }
  }
}

module.exports = {
  scanUrl,
};