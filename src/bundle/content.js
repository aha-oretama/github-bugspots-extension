'use strict';
/**
 * @author aha-oretama
 * @Date 2018/05/27.
 */
import Bugspots from 'github-bugspots';

/**
 * 画面要素、URLなどからパラメータを取得し、github-bugspotsを実行する。
 * @param callback 実行後のデータへの実行関数
 * @returns {*}
 */
function exeBugspots(callback) {
  const branch = document.querySelector('.branch-select-menu > button > span').innerHTML;
  
  const parseUrl = (tabs) => {
    const url = tabs[0].url;
    const parts = url.split('/'); // https://github.com/aha-oretama/github-bugspots-extension
    const organization = parts[3];
    const repository = parts[4];
    return {organization, repository}
  };
  
  return chrome.storage.sync.get(['token','regex'], function(data) {
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      const parse = parseUrl(tabs);
      return new Bugspots(parse.organization, parse.repository, data.token).analyze(branch, data.regex)
        .then(callback)
        .catch(e => {
          console.log(e);
        });
    });
  });
}

function storeBugspotsData(bugspots) {
  return chrome.storage.local.set({'bugspots': bugspots}, function (data) {
    console.log('bugspots: ' + data.bugspots);
  })
}

function turnOn() {
  return exeBugspots(storeBugspotsData);
}

function turnOff() {
  return chrome.storage.local.remove('bugspots');
}

function addScore() {
  let fileNames = Array.from(document.querySelectorAll('td.content > span > a'), it => it.innerHTML);
  let ageSpans = document.querySelector('td.age > span').innerHTML;

  // 該当ページでなければスキップ
  if(!ageSpans) {
    return;
  }
  
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    const url = tabs[0].url;
    chrome.storage.local.get('bugspots', function (data) {
      for(let spot of data.bugspots.spots) {
        for (let i = 0; i < fileNames.length; i++) {
          
          // The fileNames inclue only file's name , not include path. Therefore, concat url and fileNames.
          if((`${url}/${fileNames[i]}`).endsWith(spot.file)) {
            let score = document.createElement('a');
            score.className = 'score';
            score.innerHTML(`${spot.score}`);
            ageSpans[i].appendChild();
          }
        }
      }
    })
  });
}

function removeScore() {
  let score = document.querySelector('a.score');
  if(!score) {
    score.remove();
  }
}

const commitBar = document.getElementsByClassName('commit-tease')[0];
let div = document.createElement('div');
div.className = 'github-bugspots-controller';
let button = document.createElement('button');
button.className = 'btn btn-sm notDisplayed';
button.innerHTML = 'bugspots';

button.addEventListener('click', function (event) {
  let button = event.target;
  if (button.classList.contains('notDisplayed')) {
    button.classList.remove('notDisplayed');
    button.classList.add('displayed');
    turnOn();
    addScore()
  } else {
    button.classList.remove('displayed');
    button.classList.add('notDisplayed')
  
    turnOff();
    removeScore()
  }
});

div.appendChild(button);
commitBar.appendChild(div);
