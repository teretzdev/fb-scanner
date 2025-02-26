/**
 * content.js
 * Interacts with Facebook pages and sends messages to the background script.
 * Includes detailed logging and error handling.
 */

const puppeteer = require('puppeteer');
const { log } = require('./logging/clientLogger');

/**
 * Extracts posts from a Facebook page using Puppeteer.
 * @param {string} url - The URL of the Facebook page to scan.
 * @returns {Promise<Array>} - A promise that resolves to an array of extracted posts.
 */
async function extractPostsFromFacebook(url) {
  log('info', `Starting Puppeteer to extract posts from: ${url}`);
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2' });
    log('info', `Navigated to: ${url}`);

    // Extract posts using page.evaluate
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('[role="article"]');
      return Array.from(postElements).map((post) => {
        const content = post.innerText || post.textContent;
        const timestamp = post.querySelector('abbr, time')?.getAttribute('title') || 'Unknown time';
        return { content, timestamp };
      });
    });

    log('info', `Extracted ${posts.length} posts from the page`);
    return posts;
  } catch (error) {
    log('error', `Error extracting posts: ${error.message}`);
    throw error;
  } finally {
    await browser.close();
    log('info', 'Browser closed');
  }
}

module.exports = {
  extractPostsFromFacebook,
};