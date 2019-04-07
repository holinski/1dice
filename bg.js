chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    if ('options' == request.action) {
        return chrome.storage.local.get(null, sendResponse);
    }
    sendResponse({});
});

chrome.browserAction.onClicked.addListener(function (activeTab) {
    chrome.tabs.create({ url: 'https://1dice.io/' });
});