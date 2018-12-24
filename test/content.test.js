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

  const buttonSelector = '//button[text()="Bugspots"]';
  const modalSelector = '.modal-main';

  it('GitHub repository page has a bugspots button', async function () {
    const page = await browser.newPage();
    await page.goto('https://github.com/igrigorik/bugspots');

    const bugspots = await page.$x(buttonSelector);
    assert.equal(bugspots.length, 1);
  });

  it('GitHub repository page having no pagehead-action has no bugspots buttons', async function () {
    const page = await browser.newPage();
    await page.goto('https://github.com/igrigorik');


    const bugspots = await page.$x(buttonSelector);
    assert.equal(bugspots.length, 0);
  });

  it('Other repository page has no bugspots buttons', async function () {
    const page = await browser.newPage();
    await page.goto('https://www.google.co.jp/');

    const bugspots = await page.$x(buttonSelector);
    assert.equal(bugspots.length, 0);
  });

  it('When clicking button, modal shows. When clicking close button, modal closes', async function () {
    const page = await browser.newPage();
    await page.goto('https://github.com/igrigorik/bugspots');

    let modal = await page.waitForSelector(modalSelector, {hidden: true});
    assert(!!modal);

    // Open modal
    const bugspots = await page.$x(buttonSelector);
    await bugspots[0].click();
    modal = await page.waitForSelector(modalSelector, {visible: true});
    assert(!!modal);

    // close modal
    await page.click('.modal-main button');
    modal = await page.waitForSelector(modalSelector, {hidden: true});
    assert(!!modal);
  });
})
;

