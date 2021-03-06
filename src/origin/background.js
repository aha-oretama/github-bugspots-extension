var rule = {
  conditions: [new chrome.declarativeContent.PageStateMatcher({
    pageUrl: {hostEquals: 'github.com'},
  })
  ],
  actions: [new chrome.declarativeContent.ShowPageAction()]
};

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([rule]);
  });
});

chrome.tabs.onUpdated.addListener(
  function (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it like send the new url to contentscripts.js
    if (changeInfo.url) {
      chrome.tabs.sendMessage(tabId, {
        message: 'url-changed'
      })
    }
  }
);
