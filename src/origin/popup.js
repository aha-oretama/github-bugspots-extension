'use strict';
/**
 * @author aha-oretama
 * @Date 2018/05/26.
 */
const token = document.querySelector('#token');
const regex = document.querySelector('#regex');
const save = document.querySelector('#save');

chrome.storage.sync.get('token', function(data) {
  console.log('token: ' + data.token);
  token.value = data.token || '';
});

chrome.storage.sync.get('regex', function(data) {
  console.log('regex: ' + data.regex);
  regex.value = data.regex || "\\b(fix(es|ed)?|close(s|d)?)\\b"
});

document.querySelector('#supplement').addEventListener('click', function () {
  chrome.tabs.create({ url: 'https://github.com/settings/tokens' });
});

document.querySelector('#github-bugspots-log').addEventListener('click', function () {
  chrome.tabs.create({ url: 'https://github.com/aha-oretama/github-bugspots-extension' });
});

save.addEventListener('click', function () {
  const tokenStr = token.value;
  const regexStr = regex.value;
  chrome.storage.sync.set({token: tokenStr}, function () {
    console.log('Save token. :' + tokenStr);
    chrome.storage.sync.set({regex: regexStr}, function () {
      console.log('Save regex. :' + regexStr);
      window.close()
    });
  });
});
