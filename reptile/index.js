const puppeteer = require('puppeteer');
const mode = require('../mysql/mode');
// const schedule = require('node-schedule');

// const time = schedule.scheduleJob('0/10 * * * * ? *', function(fireDate) {
//     console.log('haha' + fireDate)
// });

const spider = async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.toutiao.com/');
    const dimensions = await page.evaluate(() => {
        const ret = []
        const list = document.getElementsByClassName('title-box')
        Array.from(list).forEach((item) => {
            ret.push(item.firstChild.text)
        })
        return {
            html: ret,
            deviceScaleFactor: window.devicePixelRatio
        }
    });
    await browser.close();
    return dimensions
}

module.exports = spider;