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

  it('popup', async function () {
    const page = await browser.newPage();
    await page.goto('chrome-extension://gcgnjkmkkdllmfeeggghobokcnnfmjgg/popup.html');

    const id = await page.$('input[id="token"]');
    const regex = await page.$('input[id="regex"]');
    const saveButton = await page.$('button[id="save"]');
    assert(id);
    assert(regex);
    assert(saveButton);
  });
});

