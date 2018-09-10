const puppeteer = require('puppeteer');

const spider = (url, className) => {
  return (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const dimensions = await page.evaluate((className) => {
      return Array.from(document.querySelectorAll(className)).map((item) => {
        return {
          html: item.innerHTML,
          src: item.src || null,
          href: item.href || null,
          dataset: item.item || null
        }
      })
    }, className);
    await browser.close();
    return dimensions
  })();
};
module.exports = spider