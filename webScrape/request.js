const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const fs = require('fs');

// Function to scrape data and return submission times
async function scrapeLeetCode(username) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Set User-Agent to mimic a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');

    // Go to the profile page
    await page.goto(`https://leetcode.com/u/${username}/`, { waitUntil: 'networkidle2' });

    // Wait for the main container to load
    await page.waitForSelector('.flex.h-\\[56px\\].items-center.rounded.px-4');

    // Extract Page Content
    const content = await page.content();
    await browser.close();

    // Save HTML Content to a Text File
    fs.writeFileSync('pageContent.txt', content, 'utf8');
    console.log('HTML content saved to pageContent.txt');

    // Load HTML Content into Cheerio
    const $ = cheerio.load(content);

    // Array to store submission times
    const submissionTimes = [];

    // Select elements with the specified class combination for submission times only
    $('.flex.h-\\[56px\\].items-center.rounded.px-4').each((i, element) => {
        const submissionTime = $(element)
            .find('span.text-label-3.dark\\:text-dark-label-3.lc-md\\:inline.hidden.whitespace-nowrap')
            .text()
            .trim();

        // Add to the array if not empty
        if (submissionTime) {
            submissionTimes.push(submissionTime);
        }
    });

    return submissionTimes;
}

module.exports = scrapeLeetCode;
