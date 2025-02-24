const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to log in to Facebook
async function loginToFacebook() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to Facebook login page
    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });

    // Enter email and password
    await page.type('#email', process.env.FB_EMAIL, { delay: 100 });
    await page.type('#pass', process.env.FB_PASSWORD, { delay: 100 });

    // Click the login button
    await Promise.all([
      page.click('[name="login"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    console.log('Logged in to Facebook successfully.');
    return { browser, page };
  } catch (error) {
    console.error('Error during Facebook login:', error);
    await browser.close();
    throw error;
  }
}

// Function to scrape posts from a specific Facebook group
async function scrapeGroupPosts(groupUrl) {
  const { browser, page } = await loginToFacebook();

  try {
    // Navigate to the Facebook group page
    await page.goto(groupUrl, { waitUntil: 'networkidle2' });

    // Wait for posts to load
    await page.waitForSelector('[role="feed"]');

    // Extract posts
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('[role="article"]');
      const postData = [];

      postElements.forEach((post) => {
        const content = post.innerText || '';
        const linkElement = post.querySelector('a[href*="/posts/"]');
        const link = linkElement ? linkElement.href : null;

        postData.push({ content, link });
      });

      return postData;
    });

    console.log('Scraped posts successfully:', posts);
    await browser.close();
    return posts;
  } catch (error) {
    console.error('Error during group post scraping:', error);
    await browser.close();
    throw error;
  }
}

module.exports = {
  loginToFacebook,
  scrapeGroupPosts,
};
```

### Step 4: Review the Code
- **Imports and Dependencies**: The code uses `puppeteer` for browser automation and `dotenv` for environment variables, consistent with the conventions in `server.js`.
- **Environment Variables**: The Facebook email and password are securely loaded from `.env` using `dotenv`.
- **Functionality**: 
  - `loginToFacebook` handles the login process, including error handling and browser cleanup.
  - `scrapeGroupPosts` navigates to a Facebook group, waits for posts to load, and extracts post content and links.
- **Export**: Both functions are exported for use in other parts of the backend.
- **Error Handling**: Errors during login or scraping are logged, and the browser is closed to prevent resource leaks.

### Final Output
```
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Function to log in to Facebook
async function loginToFacebook() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to Facebook login page
    await page.goto('https://www.facebook.com/login', { waitUntil: 'networkidle2' });

    // Enter email and password
    await page.type('#email', process.env.FB_EMAIL, { delay: 100 });
    await page.type('#pass', process.env.FB_PASSWORD, { delay: 100 });

    // Click the login button
    await Promise.all([
      page.click('[name="login"]'),
      page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    console.log('Logged in to Facebook successfully.');
    return { browser, page };
  } catch (error) {
    console.error('Error during Facebook login:', error);
    await browser.close();
    throw error;
  }
}

// Function to scrape posts from a specific Facebook group
async function scrapeGroupPosts(groupUrl) {
  const { browser, page } = await loginToFacebook();

  try {
    // Navigate to the Facebook group page
    await page.goto(groupUrl, { waitUntil: 'networkidle2' });

    // Wait for posts to load
    await page.waitForSelector('[role="feed"]');

    // Extract posts
    const posts = await page.evaluate(() => {
      const postElements = document.querySelectorAll('[role="article"]');
      const postData = [];

      postElements.forEach((post) => {
        const content = post.innerText || '';
        const linkElement = post.querySelector('a[href*="/posts/"]');
        const link = linkElement ? linkElement.href : null;

        postData.push({ content, link });
      });

      return postData;
    });

    console.log('Scraped posts successfully:', posts);
    await browser.close();
    return posts;
  } catch (error) {
    console.error('Error during group post scraping:', error);
    await browser.close();
    throw error;
  }
}

module.exports = {
  loginToFacebook,
  scrapeGroupPosts,
};
