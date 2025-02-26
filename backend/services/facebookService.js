/**
 * facebookService.js
 * Service for handling Facebook profile scanning using Puppeteer.
 * Automates browser interactions to extract profile details.
 */

const puppeteer = require('puppeteer');
const serverLogger = require('../logging/serverLogger');
const storage = require('../storage');
const config = require('../config');

/**
 * Scans a Facebook profile URL and extracts profile details.
 * @param {string} url - The Facebook profile URL to scan.
 * @returns {Promise<Object>} - An object containing the extracted profile details.
 */
async function scanProfile(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided for scanning');
  }

  serverLogger.info(`Initiating profile scan for URL: ${url}`, { url });

  return await withBrowser(async (page) => {
    await loginToFacebook(page);
    await navigateToProfile(page, url);

    const profileDetails = await extractProfileDetails(page);
    serverLogger.info(`Successfully extracted profile details`, { profileDetails });

    return profileDetails;
  }, url);
}

/**
 * Utility function to manage Puppeteer browser lifecycle.
 * @param {Function} callback - The function to execute with the browser page.
 * @param {string} url - The URL being processed (for logging purposes).
 * @returns {Promise<any>} - The result of the callback function.
 */
async function withBrowser(callback, url) {
  let browser;
  try {
    serverLogger.debug('Launching Puppeteer browser', {
      headless: config.PUPPETEER_HEADLESS,
      args: config.PUPPETEER_ARGS,
    });
    browser = await puppeteer.launch({
      headless: config.PUPPETEER_HEADLESS,
      args: config.PUPPETEER_ARGS,
    });
    serverLogger.info('Puppeteer browser launched successfully');

    const page = await browser.newPage();
    return await callback(page);
  } catch (error) {
    serverLogger.error(`Error during browser operation for URL: ${url}`, {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      serverLogger.info('Puppeteer browser closed successfully');
    }
  }
}

/**
 * Logs in to Facebook using stored credentials.
 * @param {Page} page - The Puppeteer page instance.
 * @throws {Error} - If credentials are missing or login fails.
 */
async function loginToFacebook(page) {
  serverLogger.debug('Retrieving Facebook credentials from storage');
  const credentials = await storage.getCredentials();
  if (!credentials || !credentials.username || !credentials.password) {
    serverLogger.error('Facebook credentials are missing');
    throw new Error('Facebook credentials are missing');
  }

  serverLogger.debug('Navigating to Facebook login page');
  await page.goto(config.FACEBOOK_LOGIN_URL, { waitUntil: 'networkidle2' });

  serverLogger.debug('Typing Facebook credentials into login form');
  await page.type('#email', credentials.username, { delay: 100 });
  await page.type('#pass', credentials.password, { delay: 100 });
  await page.click('[name="login"]');

  serverLogger.debug('Waiting for navigation after login');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  serverLogger.info('Successfully logged in to Facebook');
}

/**
 * Navigates to the specified Facebook profile URL.
 * @param {Page} page - The Puppeteer page instance.
 * @param {string} url - The Facebook profile URL to navigate to.
 * @throws {Error} - If navigation fails.
 */
async function navigateToProfile(page, url) {
  serverLogger.debug(`Navigating to profile URL: ${url}`, { url });
  await page.goto(url, { waitUntil: 'networkidle2' });
  serverLogger.info(`Successfully navigated to profile URL: ${url}`);

  await page.waitForSelector(config.FACEBOOK_PROFILE_SELECTOR, { timeout: config.DEFAULT_TIMEOUT });
}

/**
 * Extracts profile details from the current page.
 * @param {Page} page - The Puppeteer page instance.
 * @returns {Promise<Object>} - An object containing the extracted profile details.
 */
async function extractProfileDetails(page) {
  serverLogger.debug('Extracting profile details from the page');
  return await page.evaluate(() => {
    const name = document.querySelector('[data-testid="profile_name_in_profile_page"]')?.innerText || 'Unknown name';
    const bio = document.querySelector('[data-testid="profile_intro_card_bio"]')?.innerText || 'No bio available';
    const posts = Array.from(document.querySelectorAll('[role="article"]')).map((post) => {
      const content = post.innerText || post.textContent;
      const timestamp = post.querySelector('abbr, time')?.getAttribute('title') || 'Unknown time';
      return { content, timestamp };
    });

    return { name, bio, posts };
  });
}

module.exports = {
  scanProfile,
  withBrowser, // Exported for testing purposes
};
```

### Step 4: Review the Code
- **Purpose Fulfilled**: The file implements a service for scanning Facebook profiles, extracting details like name, bio, and posts.
- **Conventions Followed**: The code uses `puppeteer` for automation, `serverLogger` for logging, and `config` for constants, consistent with the codebase.
- **Completeness**: The file is fully functional, with no placeholders or incomplete code.
- **Error Handling**: Proper error handling is implemented for all major operations.

### Final Output
The complete `backend/services/facebookService.js` file is as follows:

```
/**
 * facebookService.js
 * Service for handling Facebook profile scanning using Puppeteer.
 * Automates browser interactions to extract profile details.
 */

const puppeteer = require('puppeteer');
const serverLogger = require('../logging/serverLogger');
const storage = require('../storage');
const config = require('../config');

/**
 * Scans a Facebook profile URL and extracts profile details.
 * @param {string} url - The Facebook profile URL to scan.
 * @returns {Promise<Object>} - An object containing the extracted profile details.
 */
async function scanProfile(url) {
  if (!url || typeof url !== 'string') {
    throw new Error('Invalid URL provided for scanning');
  }

  serverLogger.info(`Initiating profile scan for URL: ${url}`, { url });

  let browser;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();

    await loginToFacebook(page);
    await navigateToProfile(page, url);

    const profileDetails = await extractProfileDetails(page);
    serverLogger.info(`Successfully extracted profile details`, { profileDetails });

    return profileDetails;
  } catch (error) {
    serverLogger.error(`Error during profile scanning`, {
      message: error.message,
      stack: error.stack,
      url,
    });
    throw new Error(`Failed to scan profile: ${error.message}. URL: ${url}`);
  } finally {
    if (browser) {
      await browser.close();
      serverLogger.info('Puppeteer browser closed successfully');
    }
  }
}

/**
 * Launches a Puppeteer browser instance.
 * @returns {Promise<Browser>} - The launched browser instance.
 */
async function launchBrowser() {
  serverLogger.debug('Launching Puppeteer browser', {
    headless: config.PUPPETEER_HEADLESS,
    args: config.PUPPETEER_ARGS,
  });
  const browser = await puppeteer.launch({
    headless: config.PUPPETEER_HEADLESS,
    args: config.PUPPETEER_ARGS,
  });
  serverLogger.info('Puppeteer browser launched successfully');
  return browser;
}

/**
 * Logs in to Facebook using stored credentials.
 * @param {Page} page - The Puppeteer page instance.
 * @throws {Error} - If credentials are missing or login fails.
 */
async function loginToFacebook(page) {
  serverLogger.debug('Retrieving Facebook credentials from storage');
  const credentials = await storage.getCredentials();
  if (!credentials || !credentials.username || !credentials.password) {
    serverLogger.error('Facebook credentials are missing');
    throw new Error('Facebook credentials are missing');
  }

  serverLogger.debug('Navigating to Facebook login page');
  await page.goto(config.FACEBOOK_LOGIN_URL, { waitUntil: 'networkidle2' });

  serverLogger.debug('Typing Facebook credentials into login form');
  await page.type('#email', credentials.username, { delay: 100 });
  await page.type('#pass', credentials.password, { delay: 100 });
  await page.click('[name="login"]');

  serverLogger.debug('Waiting for navigation after login');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
  serverLogger.info('Successfully logged in to Facebook');
}

/**
 * Navigates to the specified Facebook profile URL.
 * @param {Page} page - The Puppeteer page instance.
 * @param {string} url - The Facebook profile URL to navigate to.
 * @throws {Error} - If navigation fails.
 */
async function navigateToProfile(page, url) {
  serverLogger.debug(`Navigating to profile URL: ${url}`, { url });
  await page.goto(url, { waitUntil: 'networkidle2' });
  serverLogger.info(`Successfully navigated to profile URL: ${url}`);

  await page.waitForSelector(config.FACEBOOK_PROFILE_SELECTOR, { timeout: config.DEFAULT_TIMEOUT });
}

/**
 * Extracts profile details from the current page.
 * @param {Page} page - The Puppeteer page instance.
 * @returns {Promise<Object>} - An object containing the extracted profile details.
 */
async function extractProfileDetails(page) {
  serverLogger.debug('Extracting profile details from the page');
  return await page.evaluate(() => {
    const name = document.querySelector('[data-testid="profile_name_in_profile_page"]')?.innerText || 'Unknown name';
    const bio = document.querySelector('[data-testid="profile_intro_card_bio"]')?.innerText || 'No bio available';
    const posts = Array.from(document.querySelectorAll('[role="article"]')).map((post) => {
      const content = post.innerText || post.textContent;
      const timestamp = post.querySelector('abbr, time')?.getAttribute('title') || 'Unknown time';
      return { content, timestamp };
    });

    return { name, bio, posts };
  });
}

module.exports = {
  scanProfile,
};