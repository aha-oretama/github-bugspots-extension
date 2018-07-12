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
  
  const parseUrl = (url) => {
    const parts = url.split('/'); // https://github.com/aha-oretama/github-bugspots-extension
    const organization = parts[3];
    const repository = parts[4];
    return {organization, repository}
  };
  
  return chrome.storage.sync.get(['token','regex'], function(data) {
    if(!data.token) {
      return callback({tokenError: true});
    }
    
    const parse = parseUrl(location.href);
    return new Bugspots(parse.organization, parse.repository, data.token).analyze(branch, new RegExp(data.regex, "i"))
      .then(callback)
      .catch(e => {
        console.log(e);
        callback({error: true})
      });
  });
}

function storeBugspotsData(bugspots) {
  return chrome.storage.local.set({'bugspots': bugspots}, function () {
    console.log('set bugspots data: ' + bugspots);
  })
}

function turnOn() {
  startLoading();
  const innerTurnOn = (data) => {
    endLoading();
    if (data.tokenError) {
      window.alert("The token does not set. Please set your token from github-bugspots icon in toolbar.");
      return;
    }
    if (data.error) {
      window.alert("github-bugspots has errors. Please report the issue(https://github.com/aha-oretama/github-bugspots-extension/issues).")
      return;
    }
    
    storeBugspotsData(data);
    addScore(data);
  };
  
  return chrome.storage.local.get('bugspots', function (data) {
    if(Object.keys(data).length === 0) {
      return exeBugspots(innerTurnOn);
    }
    return innerTurnOn(data.bugspots);
  });
}

function turnOff() {
  chrome.storage.local.remove('bugspots', function () {
    console.log('remove bugspots data');
  });
  removeScore();
  endLoading();
}

function addScore(data) {
  let fileNames = Array.from(document.querySelectorAll('td.content > span > a'), it => it.innerHTML);
  let isFile = Array.from(document.querySelectorAll('tr.js-navigation-item > td.icon > svg'), it => it.classList.contains('octicon-file'));
  let ageSpans = document.querySelectorAll('td.age > span');

  // 該当ページでなければスキップ
  if(!ageSpans) {
    return;
  }
  
  const url = location.href;
  for (let i = 0; i < fileNames.length; i++) {
    let text = isFile[i] ? `${Number(0).toFixed(4)}` : '-' ;

    for (let spot of data.spots) {
      // The fileNames inclue only file's name , not include path. Therefore, concat url and fileNames.
      if ((`${url}/${fileNames[i]}`).endsWith(spot.file)) {
        text = `${spot.score.toFixed(4)}`;
      }
    }
    
    let score = document.createElement('a');
    let textNode = document.createTextNode(text);
    score.appendChild(textNode);
    score.className = 'gb-score';
    let firstChild = ageSpans[i].firstChild;
    ageSpans[i].insertBefore(score, firstChild);
  }
}

function startLoading() {
  let button = document.querySelector('input.gb-button');
  button.setAttribute("src", "data:image/gif;base64,R0lGODlhEAAQANUAAP////39/fv7+/n5+ff39/X19fPz8/Hx8e/v7+3t7enp6efn5+Xl5ePj49/f393d3dvb29nZ2dfX19XV1dPT09HR0c/Pz83NzcXFxb+/v7Ozs6+vr62trampqZ+fn5mZmY2NjYODg35+fm5ubmZmZmRkZFhYWD4+PjIyMi4uLg4ODgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFBwAsACwCAAIADAAMAAAGYUCWULhaDYcRk4F1SrECD4LQhPqwRCOWYvIQGj6oSGYjkCwCR4ZGiJAKSaGO5WhQPCokkCZyPDAiFUMJfCwJA0cDFx8GCAYEFGdCHB8XLA0MLAwWhAkchxN8ARFuRxeVR0EAIfkEBQcALAAsAgACAAsACwAABkBAllCIQg2FjZCQZGIhUhZWiKRhfUAs0Sol1JAal4xDNUIMExihJ2rlYBzH4UdzYcTjhcRdyLgM9hN1eywFE4NBACH5BAUHACwALAIAAgAMAAoAAAY/QJZQSCINhwnOgAUKCU0RIedzYWk6rA/KJBxcPomIhXECHVmGqFXNukwaiGNGdFpdIgzDcTNKrc6AgYKBE0JBACH5BAUHACwALAMAAgALAAsAAAZCQJaQ9fkMhYWJUMMRhhqsyYXBumBYGlJIyLgUGI7EqHMcJIQY6HF9+ZBQa2EGZIKvPY740KISIfQsIyspgAgpFixBACH5BAUHACwALAcAAgAHAAwAAAY7wMuFRSRGJqwBJ8FiNFiXD4dlQBg8mEExwiwaNSBS0dIJiVkaRnGTiZw+xJGIBUKZWKkT0RRhrVZeLEEAIfkEBQcALAAsAwADAAsACwAABj9AlnAonBSIRMZlghQOLI2mMHGUCpWaj9SB4WhZFo8QkxgiRCtH5tIYaYSplYgF0nZIIXAKwTKRhCFRRCgoSEEAIfkEBQcALAAsAgAHAAwABwAABjjAVWq0YRlZBkbksjqJMkcWojG5HCMaY8QQZX1QDEsk4bkMjCbUh9XJYj4crckYArEGnESXRSJ1gwAh+QQJBwAsACwCAAIADAAMAAAGQkCWcEgcWlKIIjG1EimHCNHK8hw6PE+UCZSpokifS3XYwAgTg6KGlHAwChbGMETSsDDixmUibISEHHYsEwVKHx9FQQA7");
}

function endLoading() {
  let button = document.querySelector('input.gb-button');
  button.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACLlBMVEUAAAAqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgqstgqstgsstkqstgqstgqstgqstgqstgsstkqstgqstgqstgpsdgqstgqstgqstgts9gqstgpstgqstgttNkpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgosdgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstj///8rAbqCAAAAuHRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwdARpZ7UDEML8D59fT8oS4IP+bph0NJmvPXIQt18mhSPAOK7mIHKd/PKnjWxmY06b8RDL3AEov3aBzdnQQo1OAiW7/AOD7xuRZN9aEwDxY3vOgwMbTsz5KY2+KdHAEGkcvp4MpzABBibmFjb1YHTPTxOFv85S6O/c4SKub3agM4XXUACYZRLwMKAQsBWiMI7AAAAAFiS0dEuTq4FmAAAAAHdElNRQfiBwgXNCaQgicpAAAA6ElEQVQY02NgAANGbR0mBjhgZtHV0zcwNGKF8tmMTUzNzC0sraxt2MECHLZ29g6OTs4urm6cID6Xu4enF7e3j6+ff0AgD1CANyg4JDQsPCIyKjomlg8owB8Xn5CYtCM5JTUtPUMAKCCYmZWdk5uXX1BYVFwiBBQQFiktK6+orKquqa0TFQOZKl7f0NjU3NLa1t4hAbZWsrOru6e3r3+C1ERpiMtkJk2eMnXa9BkzZSF8OflZs+fMnTd/wUIFiICi0qLFS5YuW75ipbIKWEB11eo1a9et37Bxk5o61Hsam7dobt22XQvEBgCP3EJ9EpKLQwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0wOFQyMzo1MjozOC0wNDowMDdKhBkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMDhUMjM6NTI6MzgtMDQ6MDBGFzylAAAAAElFTkSuQmCC");
}

function removeScore() {
  let scores = document.querySelectorAll('a.gb-score');
  if (scores) {
    for(let score of scores) {
      score.remove();
    }
  }
}

(function onload() {
  const commitBar = document.querySelector('.commit-tease');
  if(!commitBar) {
    return;
  }
  
  let div = document.createElement('div');
  div.className = 'gb-controller';
  let button = document.createElement('input');
  button.className = 'btn btn-sm gb-button';
  button.setAttribute("type", "image");
  button.setAttribute("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACLlBMVEUAAAAqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgrstgqstgqstgqstgqstgqstgqstgqstgqstgsstkqstgqstgqstgqstgqstgsstkqstgqstgqstgpsdgqstgqstgqstgts9gqstgpstgqstgttNkpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgpstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstgosdgqstgqstgqstgqstgqstgqstgqstgqstgqstgqstj///8rAbqCAAAAuHRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACwdARpZ7UDEML8D59fT8oS4IP+bph0NJmvPXIQt18mhSPAOK7mIHKd/PKnjWxmY06b8RDL3AEov3aBzdnQQo1OAiW7/AOD7xuRZN9aEwDxY3vOgwMbTsz5KY2+KdHAEGkcvp4MpzABBibmFjb1YHTPTxOFv85S6O/c4SKub3agM4XXUACYZRLwMKAQsBWiMI7AAAAAFiS0dEuTq4FmAAAAAHdElNRQfiBwgXNCaQgicpAAAA6ElEQVQY02NgAANGbR0mBjhgZtHV0zcwNGKF8tmMTUzNzC0sraxt2MECHLZ29g6OTs4urm6cID6Xu4enF7e3j6+ff0AgD1CANyg4JDQsPCIyKjomlg8owB8Xn5CYtCM5JTUtPUMAKCCYmZWdk5uXX1BYVFwiBBQQFiktK6+orKquqa0TFQOZKl7f0NjU3NLa1t4hAbZWsrOru6e3r3+C1ERpiMtkJk2eMnXa9BkzZSF8OflZs+fMnTd/wUIFiICi0qLFS5YuW75ipbIKWEB11eo1a9et37Bxk5o61Hsam7dobt22XQvEBgCP3EJ9EpKLQwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOC0wNy0wOFQyMzo1MjozOC0wNDowMDdKhBkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTgtMDctMDhUMjM6NTI6MzgtMDQ6MDBGFzylAAAAAElFTkSuQmCC");
  
  button.addEventListener('click', function (event) {
    let button = event.target;
    if (button.classList.contains('selected')) {
      button.classList.remove('selected');
      turnOff();
      removeScore();
    } else {
      button.classList.add('selected');
      turnOn();
    }
  });
  chrome.storage.local.get('bugspots', function (data) {
    if (Object.keys(data).length !== 0) {
      document.querySelector('input.gb-button').classList.add('selected');
      addScore(data.bugspots);
    }
  });
  
  div.appendChild(button);
  const lastChild = _.last(commitBar.querySelectorAll('div'));
  commitBar.insertBefore(div, lastChild);
})();
