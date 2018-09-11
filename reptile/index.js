const puppeteer = require('puppeteer');

const spider = (url, className) => {
  return (async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const dimensions = await page.evaluate((className) => {
      let classNameList = className.split(',')
      let ret = []
      for(let i = 0; i< classNameList.length; i++) {
        const documentNodeList = document.querySelectorAll(classNameList[i])
        if (documentNodeList.length > 0) {
          ret = Array.from(documentNodeList).map((item) => {
            return {
              html: item.innerHTML,
              src: item.src || null,
              href: item.href || null,
              dataset: item.item || null
            }
          })
          break;
        } else {
          continue;
        }
      }
      return ret
    }, className);
    await browser.close();
    return dimensions
  })();
};
module.exports = spider