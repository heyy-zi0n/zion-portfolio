import puppeteer from 'puppeteer';
import path from 'path';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // URL to the local HTML file
  await page.goto(`file://${path.resolve('cv.html')}`, {waitUntil: 'networkidle0'});
  
  await page.pdf({
    path: 'public/zion-faith-omosanya-cv.pdf',
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0px',
      bottom: '0px',
      left: '0px',
      right: '0px'
    }
  });

  await browser.close();
})();
