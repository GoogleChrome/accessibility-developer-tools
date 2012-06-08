var tabs = {};

chrome.extension.onRequest.addListener(function(request, sender, callback) {
    var tabId = request.tabId;

    if (!(tabId in tabs)) {
        chrome.tabs.executeScript(tabId, { file: '_generated_accessibility.js' }, function() {
            if (chrome.extension.lastError) {
                callback({ error: chrome.extension.lastError.message });
                return;
            }
        });
        tabs[tabId] = true;
        callback();
    }
});
