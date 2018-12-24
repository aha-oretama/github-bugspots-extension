import puppeteer from 'puppeteer';
import path from 'path';
import assert from 'power-assert';

describe('backgroud.js', function () {
  let browser;

  beforeEach(async function () {
    const pathToExtension = path.join(__dirname, '../dist');
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 250,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ]
    });
  });

  afterEach(async function () {
    await browser.close();
  });

  it('GitHub repository page has a bugspots button', async function () {
    const page = await browser.newPage();
    await page.goto('https://github.com/igrigorik/bugspots');

    const bugspots = await page.$x('//button[text()="Bugspots"]');
    assert.equal(bugspots.length, 1);
  });

  it('Other repository page has no bugspots buttons', async function () {
    const page = await browser.newPage();
    await page.goto('https://www.google.co.jp/');

    const bugspots = await page.$x('//button[text()="Display bugspots"]');
    assert.equal(bugspots.length, 0);
  });
});

