/**
 * @author aha-oretama
 * @Date 2018/05/27.
 */
import Bugspots from './bugspots';

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
    chrome.storage.sync.get('token', function (data) {
      new Bugspots('aha-oretama', "TypoFixer", data.token).analyze('*', 'master')
        .then(data => {
          const spots = data.spots;
          let parentSpan = document.querySelector(`a[title="${spots.file}"]`) // href tag in which file exists
              .closest('tr.js-navigation-item') // tr in which file exists
              .querySelector('td.age span'); // age's td which is same row at above file and to be replaced
          let score = document.createElement('a');
          score.className = 'score';
          score.innerHTML(`${spots.score}`);
          parentSpan.appendChild(score);
        })
    });
  } else {
    let score = document.querySelector('a.score');
    score.remove();

    button.classList.remove('displayed');
    button.classList.add('notDisplayed')
  }
});

div.appendChild(button);
commitBar.appendChild(div);
