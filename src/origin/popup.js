/**
 * @author aha-oretama
 * @Date 2018/05/26.
 */
const token = document.getElementById('token');
const saveToken = document.getElementById('saveToken');

chrome.storage.sync.get('token', function (data) {
  token.innerHTML = data.token;
});

saveToken.onclick = function (element) {
  const tokenStr = token.value;
  chrome.storage.sync.set({token: tokenStr}, function () {
    console.log('token: ' + tokenStr);
  });
  window.close();
};
