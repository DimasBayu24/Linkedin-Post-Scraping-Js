const cheerio = require('cheerio');

const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setCookie({
        "name": "li_at",
        //remember, you need to login first to get cookies and put it in code below
        "value": "FILL YOUR OWN COOKIES",
        "domain": ".www.linkedin.com"
    })
    await page.setDefaultNavigationTimeout(0);
    await page.goto(`https://www.linkedin.com/showcase/${COMPANY_NAME}/posts/?feedView=all`, { waitUntil: 'domcontentloaded' })
    await autoScroll(page);

    await page.screenshot({
        path: 'yoursite.png',
        fullPage: true
    })
        .then(() => {
            const content = page.content();
            content
                .then((res) => {
                    const data = {}
                    const $ = cheerio.load(res);
                    $(`.occludable-update`).each((index, element) => {
                        console.log(index);
                        console.log($(element).children('div').children('div').children('div:nth-of-type(3)').children('div').children('div').children('span').children('span').children('span').text());
                    })
                })
        })

    // await browser.close();
})();

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 400;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}