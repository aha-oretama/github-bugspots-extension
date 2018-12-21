import puppeteer from 'puppeteer';
import path from 'path';

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', async function () {
      const pathToExtension = path.join(__dirname, '../dist');
      const browser = await puppeteer.launch({
        headless: false,
        args: [
          `--disable-extensions-except=${pathToExtension}`,
          `--load-extension=${pathToExtension}`
        ]
      });
      const targets = await browser.targets();
      const backgroundPageTarget = targets.find(target => target.type() === 'background_page');
      const backgroundPage = await backgroundPageTarget.page();
      // Test the background page as you would any other page.
      await browser.close();
    });
  });
});

