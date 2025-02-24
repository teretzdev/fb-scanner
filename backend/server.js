const express = require('express');
const puppeteer = require('puppeteer');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to trigger Puppeteer scraping
app.get('/scrape', async (req, res) => {
  try {
    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to a sample page (replace with actual scraping logic later)
    await page.goto('https://example.com');

    // Extract data (mock data for now)
    const scrapedData = await page.evaluate(() => {
      return {
        title: document.title,
        url: window.location.href,
      };
    });

    // Close the browser
    await browser.close();

    // Send the scraped data as a response
    res.json({
      success: true,
      data: scrapedData,
    });
  } catch (error) {
    console.error('Error during scraping:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while scraping.',
    });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
